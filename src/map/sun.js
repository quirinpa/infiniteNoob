"use strict";
const daysPerTick = require('./constants').daysPerTick;
let sunA = Math.PI / 2;
module.exports = (N, dt) => {
	const s = new Array(N * N);
	sunA += daysPerTick * dt;
	const aux = 2 * Math.PI / N;
	for (let x = 0; x < N; x++) {
		const pixelA = x * aux;
		const a = Math.abs(pixelA - sunA);
		const il = Math.cos(a); // relative temperature
		// if (il < 0) il = 0;
		// can't do this, must always decrease
		// temperature on the other side of planet

		// console.log(pixelA, sunA, a, il, x);
		for (let y = 0; y < N; y++)
			s[x + y * N] = il;
	}
	return s;
}
