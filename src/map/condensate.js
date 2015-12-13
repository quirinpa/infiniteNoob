"use strict";
module.exports = (m, dt, rate) => {
	const c = rate * dt;
	const condensationT = 0.2;
	const amount = m.ah.map((able, idx) => {
		const at = m.at[idx];
		if (at < condensationT) {
			const willing = at;
			const res = willing > able ? able : willing;
			return res > 0 ? res : 0;
		}
		return 0;
	});
	m.ah = m.ah.map((val, idx) => val - amount[idx]);
	m.w = m.w.map((val, idx) => val + amount[idx]);
};
