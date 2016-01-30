"use strict";
const normalize = require('./normalize');
module.exports = (N, hm, wl) => {
	const m = new Array(N * N);

	function doForY(x, yN, t) {
		const h = hm[x + yN];
		m[x + yN] = t * (1 - (h > wl ? (h - wl) / (1 - wl) : 0));
	};

	const hN = N / 2;
	for (let y = 0; y < hN; y++) {
		const t = Math.sqrt(1 - y / hN);

		const yUN = (hN - y - 1) * N;
		const yDN = (hN + y) * N;

		for (let x = 0; x < N; x++) {
			doForY(x, yUN, t);
			doForY(x, yDN, t);
		}
	}
	return normalize(m);
}
