"use strict";
module.exports = (w, p, ah, dt) => {
	const d = p
		.map(val => val * dt) // rate of evaporation
		.map((val, idx) => val * w[idx]); // evaporated density

	return {
		w: w.map((val, idx) => val - d[idx]),
		ah: ah.map((val, idx) => val + d[idx])
	};
};
