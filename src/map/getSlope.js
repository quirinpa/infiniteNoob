"use strict";
// http://www.dummies.com/how-to/content/how-to-calculate-force-based-on-pressure.html
module.exports = (N, m, factor) => {
	const sX = new Array(N * N);
	const sY = new Array(N * N);

	for (let y = 0; y < N; y++) {
		const yN = y * N;

		const y0N = (y === 0 ? N - 1 : y - 1) * N;
		const y1N = (y === N - 1 ? 0 : y + 1) * N;

		for (let x = 0; x < N; x++) {
			const x0 = x === 0 ? N - 1 : x - 1;
			const x1 = x === N - 1 ? 0 : x + 1;

			const a = m[x0 + y0N];
			// const b = p[x + y0N]; //
			const c = m[x1 + y0N];
			// const d = p[x0 + yN]; //
			// const e = p[x + yN]; // NOT HERE
			// const f = p[x1 + yN]; //
			const g = m[x0 + y1N];
			// const h = p[x + y1N]; //
			const i = m[x1 + y1N];

			const pXa = (c + m[x1 + yN] + i) / 3;
			const nXa = (a + m[x0 + yN] + g) / 3;
			const pYa = (g + m[x + y1N] + i) / 3;
			const nYa = (a + m[x + y0N] + c) / 3;

			sX[x + yN] = (pXa - nXa) * factor;
			sY[x + yN] = (pYa - nYa) * factor;
		}
	}

	return {x: sX, y: sY};
};
