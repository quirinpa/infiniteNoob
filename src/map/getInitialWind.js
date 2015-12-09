"use strict";
// http://www.dummies.com/how-to/content/how-to-calculate-force-based-on-pressure.html
module.exports = (N, p, mul) => {
	const wX = new Array(N * N);
	const wY = new Array(N * N);

	for (let y = 0; y < N; y++) {
		const yN = y * N;

		const y0N = (y === 0 ? N - 1 : y - 1) * N;
		const y1N = (y === N - 1 ? 0 : y + 1) * N;

		for (let x = 0; x < N; x++) {
			const x0 = x === 0 ? N - 1 : x - 1;
			const x1 = x === N - 1 ? 0 : x + 1;

			const a = p[x0 + y0N];
			// const b = p[x + y0N]; //
			const c = p[x1 + y0N];
			// const d = p[x0 + yN]; //
			// const e = p[x + yN]; // NOT HERE
			// const f = p[x1 + yN]; //
			const g = p[x0 + y1N];
			// const h = p[x + y1N]; //
			const i = p[x1 + y1N];

			const pXa = (c + p[x1 + yN] + i) / 3;
			const nXa = (a + p[x0 + yN] + g) / 3;
			const pYa = (g + p[x + y1N] + i) / 3;
			const nYa = (a + p[x + y0N] + c) / 3;

			wX[x + yN] = (pXa - nXa) * mul;
			wY[x + yN] = (pYa - nYa) * mul;
		}
	}

	return {x: wX, y: wY};
};
