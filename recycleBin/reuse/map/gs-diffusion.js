"use strict";
// works for large values of diff
module.exports = (N, m0s, diff, dt) => {
	const a = dt * diff;
	const b = 1 + 4 * a;
	const ms = m0s.map(() => new Array(N * N));
	for (let y = 0; y < N; y++) {
		const yN = y * N;
		const y0N = (y === 0 ? N - 1 : y - 1) * N;
		const y1N = (y === N - 1 ? 0 : y + 1) * N;
		for (let x = 0; x < N; x++) {
			const x0 = x === 0 ? N - 1 : x - 1;
			const x1 = x === N - 1 ? 0 : x + 1;

			for (let i = 0; i < m0s.length; i++) {
				const m = ms[i];
				const m0 = m0s[i];

				m[x + yN] =  (m0[x + yN] + (
					m0[x + y0N] +
					m0[x0 + yN] + m0[x1 + yN] +
					m0[x + y1N]
				) * a) / b;
			}
		}
	}

	return ms;
}
