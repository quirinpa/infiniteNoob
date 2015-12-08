"use strict";
const frand = require('./frand');
const _scale = 1;
const _scaleMod = 1;

module.exports = (N, _steps) => {
	const m = new Array(N * N);
	// first step size
	const fSS = _steps[0][0];
	// initialize steps array
	const steps = _steps.map(v => ({
		scale: 1 - (v[0] / fSS), f: v[1],
	}));
	// randomize initial values
	const fhS = fSS / 2;
	for (let y = 0; y < N; y += fSS) {
		const yN = y * N;
		let x = 0;
		do {
			m[x + yN] = frand();
			x += fSS;
		} while (x < N);
	}

	let SS = fSS;
	let scaleMod = _scaleMod;

	do {
		const hSS = SS / 2;
		// square
		for (let y = 0; y < N; y += SS) {
			const yN = y * N;
			let y2N = y + SS;
			if (y2N >= N) y2N -= N;
			y2N *= N;
			const y1N = (y + hSS) * N;
			for (let x = 0; x < N; x += SS) {
				let x2 = x + SS;
				if (x2 >= N) x2 -= N;
				const avg = (
					m[x + yN] +
					m[x2 + yN] +
					m[x + y2N] +
					m[x2 + y2N]
				) / 4.0;
				let e = avg;
				for (let i = 0; i < steps.length; i++)
					e = steps[i].f(e, steps[i].scale, avg, x, y); // e = steps[i](e, stepScale, x, y);

				m[x + hSS + y1N] = e;
			}
		}
		// console.log('sq', SS, m);
		// diamond
		for (let y = 0; y < N; y += SS) {
			const yN = y * N;
			let y2N = y + SS;
			if (y2N >= N) y2N -= N;
			y2N *= N;
			const y1N = (y + hSS) * N;
			let y0N = y - hSS;
			if (y0N < 0) y0N += N;
			y0N *= N;
			for (let x = 0; x < N; x += SS) {
				const x1 = x + hSS;
				let x2 = x + SS;
				if (x2 >= N) x2 -= N;
				let x0 = x - hSS;
				if (x0 < 0) x0 += N;

				const avgH = (
					m[x1 + y0N] +
					m[x + yN] +
					m[x2 + yN] +
					m[x1 + y1N]
				) / 4.0;

				const avgG = (
					m[x + yN] +
					m[x0 + y1N] +
					m[x1 + y1N] +
					m[x2 + yN]
				) / 4.0;

				let h = avgH;
				let g = avgG;

				for (let i = 0; i < steps.length; i++) {
					h = steps[i].f(h, steps[i].scale * 0.5, avgH, x, y);
					g = steps[i].f(g, steps[i].scale * 0.5, avgG, x, y);
				}

				m[x1 + yN] = h;
				m[x + y1N] = g;
			}
		}
		// console.log('dmd', SS, m);

		SS /= 2;
		scaleMod *= 0.3;
		for (let i = 0; i < steps.length; i++)
			steps[i].scale *= scaleMod + 0.8;
	} while (SS > 1);

	return m;
}
