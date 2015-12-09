"use strict";
// https://en.wikipedia.org/wiki/Evaporation#Factors_influencing_the_rate_of_evaporation
module.exports = (m, dt) => {
	const d = m.t
		.map((val, idx) => val * dt * (m.w[idx] - m.ah[idx]));

	m.w = m.w.map((val, idx) => val - d[idx]);
	m.ah = m.ah.map((val, idx) => val + d[idx])
};
