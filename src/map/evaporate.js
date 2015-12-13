"use strict";
// https://en.wikipedia.org/wiki/Evaporation#Factors_influencing_the_rate_of_evaporation
module.exports = (m, dt) => {
	// const amount = m.w.map(val => val * dt);
	// assume surface area is equal in all squares
	// (rivers should have less)
	const e = 0.1 * dt;
	const evaporationT = 0.1;
	const amount = m.w.map((able, idx) => {
		const t = m.t[idx];
		if (t >= evaporationT) {
			const willing = t;
			let res = (willing > able ? able : willing);
			if (res <= 0) return 0;
			// if (res > 0.1) res = 0.1;
			return res * e;
		}
		return 0;
	});
	m.w = m.w.map((val, idx) => val - amount[idx]);
	m.ah = m.ah.map((val, idx) => val + amount[idx]);
};
