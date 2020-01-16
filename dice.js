const pool = [
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=0.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=1.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=2.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=4.json',
	'https://v3-cinemeta.strem.io/catalog/movie/top/skip=5.json',
	'https://v3-cinemeta.strem.io/catalog/movie/imdbRating/skip=0.json',
	'https://v3-cinemeta.strem.io/catalog/movie/imdbRating/skip=1.json',
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
		const tryMore = !item.description || !item.director
		if (tryMore) fetch(`https://v3-cinemeta.strem.io/meta/${item.type}/${item.id}.json`)
			.then(resp => resp.json())
			.then(resp => { if (resp.meta) render(resp.meta) })
	})

function render(item) {
	const releaseInfo = item.releaseInfo || item.year;
	movieTitle.innerText = `${item.name}${releaseInfo ? ' ('+releaseInfo+')' : ''}`
	openIn.href = `stremio://detail/${item.type}/${item.id}/${item.id}`
	description.innerHTML = item.description || ''
	if (item.director) description.innerHTML += `<br><br><i>Director:</i> ${item.director}`
	if (Array.isArray(item.cast) && item.cast.length) description.innerHTML += `<br><br><i>Cast:</i> ${item.cast.join(', ')}`
	document.body.style.background = `url('https://images.metahub.space/background/medium/${item.id}/img')`
}

