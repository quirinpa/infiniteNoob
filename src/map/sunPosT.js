"use strict";
let sunA = 0;
module.exports = (N, t, dt) => {
	const st = new Array(N * N);
	sunA += 0.1 * dt;
	const aux = 2 * Math.PI / N;
	for (let x = 0; x < N; x++) {
		const pixelA = x * aux;
		const a = Math.abs(pixelA - sunA);
		const il = (Math.cos(a) + 1) / 2;
		// console.log(pixelA, sunA, a, il, x);
		for (let y = 0; y < N; y++) {
			const idx = x + y * N;
			st[idx] = t[idx] * il;
		}
	}
	return st;
}
