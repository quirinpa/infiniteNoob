"use strict";
// https://en.wikipedia.org/wiki/Evaporation#Factors_influencing_the_rate_of_evaporation
module.exports = (m, dt, rate) => {
	// const amount = m.w.map(val => val * dt);
	// assume surface area is equal in all squares
	// (rivers should have less)
	const e = rate * dt;
	const amount = m.w.map((val, idx) => {
		const re = e * m.t[idx];
		const amt = re <= val ? re : val;
		// return re;
		return amt < 0 ? 0 : amt;
	});
	m.w = m.w.map((val, idx) => val - amount[idx]);
	m.ah = m.ah.map((val, idx) => val + amount[idx]);
};
