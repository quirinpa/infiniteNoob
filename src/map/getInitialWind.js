"use strict";
// http://www.dummies.com/how-to/content/how-to-calculate-force-based-on-pressure.html
module.exports = (N, p) => {
	const wX = new Array(N * N);
	const wY = new Array(N * N);

	let y0 = N - 1;
	let y0N = y0 * N;
	let y = 0;
	let yN = 0;
	let y1 = 1;
	let y1N = N;

	function runX() {
		let x0 = N - 1;
		let x = 0;
		let x1 = 1;

		const a = p[x0 + y0N];
		const b = p[x + y0N]; //
		const c = p[x1 + y0N];
		const d = p[x0 + yN]; //
		const e = p[x + yN]; // NOT HERE
		const f = p[x1 + yN]; //
		const g = p[x0 + y1N];
		const h = p[x + y1N]; //
		const i = p[x1 + y1N];

		const pXa = (c + f + i) / 3;
		const nXa = (a + d + g) / 3;
		const pYa = (g + h + i) / 3;
		const nYa = (a + b + c) / 3;

		wX[x + yN] = pXa - nXa;
		wY[x + yN] = pYa - nYa;
	}

	while (y1 < N) {
		runX();
		y0++; y++; y1++;
		y0N += N; yN += N; y1N += N;
	}

	y1 = 0;
	y1N = 0;
	runX();

	return {x: wX, y: wY};
};
