"use strict";
module.exports = (N, m, dt, wl) => {
	const t = m.w.map((v, i) => v + m.h[i]);
	const r = m.w.map(v => v);
	function chooseSmallest(idxArr) {
		let min = idxArr[0];
		let minV = t[min];
		let i = 1;
		while (i < idxArr.length) {
			const idx = idxArr[i];
			const v = t[idx];
			if (v < minV) {
				minV = v;
				min = idx;
			}
			i+=1;
		}
		return min;
	}
	for (let y = 0; y < N; y++) {
		const yN = y * N;
		const y0N = (y === 0 ? N - 1 : y - 1) * N;
		const y1N = (y === N - 1 ? 0 : y + 1) * N;
		for (let x = 0; x < N; x++) {
			const x0 = x === 0 ? N - 1 : x - 1;
			const x1 = x === N - 1 ? 0 : x + 1;
			const snIdx = chooseSmallest([
				x0 + y0N, x + y0N, x1 + y0N,
				x0 + yN, x1 + yN,
				x0 + y1N, x + y1N, x1 + y1N,
			]); // smallest neighboor
			const idx = x + yN;
			if (t[idx] > t[snIdx]) {
				let nnv = r[snIdx] + r[idx];
				let nv = 0;
				let nnt = nnv + m.h[snIdx];
				let nt = m.h[idx];
				if (nnt > nt) {
					const share = (nnt - nt) / 2;
					nnv -= share;
					nv += share;
				}
				r[snIdx] = nnv;
				r[idx] = nv;
				// m.h[snIdx] -= nnv * 1;
			}
		}
	}
	m.h = m.h.map((h, i) => {
		const p = m.w[i];
		const c = r[i];
		if (p < c) return h - (c - p) * 0.05;
		return h;
	});
	m.w = r;
};
