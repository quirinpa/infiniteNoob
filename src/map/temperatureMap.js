"use strict";
const normalize = require('./normalize');
module.exports = (N, hm, wl) => {
	const m = new Array(N * N);

	function doForY(x, yN, t) {
		const h = hm[x + yN];
		m[x + yN] = t * (1 - (h < wl ? wl : h));
	};

	const hN = N / 2;
	for (let y = 0; y < hN; y++) {
		const t = 1 - y / hN;

		const yUN = (hN - y) * N;
		const yDN = (hN + y) * N;

		for (let x = 0; x < N; x++) {
			doForY(x, yUN, t);
			doForY(x, yDN, t);
		}
	}

	// return normalize(m);
	return m;
}

// Assuming, there is currently no wind (not a solid assumption),
// temperature is either directly or inversely proportional
// (depending if we are talking surface or high-altitude) to pressure.
// This is due to the equation PV = nRT. n, R and V are roughly proportional.
