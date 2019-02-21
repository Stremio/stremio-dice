const pool = [
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=0.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=1.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=2.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=4.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=5.json',
	'https://stremio-imdb-list.now.sh/ls028057361/catalog/movie/imdb-movie-list.json',
	'https://stremio-imdb-list.now.sh/ls041868378/catalog/movie/imdb-movie-list.json',
	'https://stremio-imdb-list.now.sh/ls045252260/catalog/movie/imdb-movie-list.json',
];

const shuffleArray = arr => arr
	.map(a => [Math.random(), a])
	.sort((a, b) => a[0] - b[0])
	.map(a => a[1])

const MAX_REQUESTS = 3
const requests = shuffleArray(pool)
	.slice(0, MAX_REQUESTS)
	.map(url => fetch(url).then((resp) => resp.json()))

// @TODO consider ignoring errors if only some of the requests failed
Promise.all(requests)
	.then((everything) => {
		const all = everything.map(x => Array.isArray(x.metas) ? x.metas : [])
			.reduce((a, b) => a.concat(b), [])
		const shuffled = shuffleArray(all)
		const item = shuffled[0]
		render(item)
	})

function render(item) {
	const releaseInfo = item.releaseInfo || item.year;
	movieTitle.innerText = `${item.name}${releaseInfo ? ' ('+releaseInfo+')' : ''}`
	openIn.href = `stremio://detail/${item.type}/${item.id}/${item.id}`
	description.innerHTML = item.description || ''
	if (item.director) description.innerHTML += `<br><br><i>Director:</i> ${item.director}`
	if (item.cast) description.innerHTML += `<br><br><i>Cast:</i> ${item.cast.join(', ')}`
	document.body.style.background = `url('https://images.metahub.space/background/medium/${item.id}/img')`
}

