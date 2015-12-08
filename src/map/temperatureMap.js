"use strict";
const tow = 0.0001;
// const step = y => y;
// const nStrength = 0.2;
module.exports = (N, hm, wl) => {
	const m = new Array(N * N);

	// water temperature
	const wt = wl - tow * 0.5;
	// land temperature helper
	const mul = 1 - (wl - tow * 0.5);

	function doForY(x, yN, t) {
		// height at this point
		const h = hm[x + yN];
		// land temperature
		const lt = (1 - mul * h);
		m[x + yN] = t * (h < wl ? wt : lt);
	};

	const hN = N / 2;
	for (let y = 0; y < hN; y++) {
		const t = 1 - y / hN;

		let yUN = hN - y;
		if (yUN < 0) yUN += N;
		yUN *= N;

		let yDN = hN + y;
		if (yDN > N) yDN -= N;
		yDN *= N;

		for (let x = 0; x < N; x++) {
			doForY(x, yUN, t);
			doForY(x, yDN, t);
		}
	}

	return m;
}

// Assuming, there is currently no wind (not a solid assumption),
// temperature is either directly or inversely proportional
// (depending if we are talking surface or high-altitude) to pressure.
// This is due to the equation PV = nRT. n, R and V are roughly proportional.
