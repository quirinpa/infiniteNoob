"use strict";
module.exports = m => {
	let min = m[0];
	let max = min;
	for (let i = 1; i < m.length; i++) {
		if (m[i] < min) min = m[i];
		if (m[i] > max) max = m[i];
	}
	const divisor = max - min;
	return m.map(val => (val - min) / divisor);
};
