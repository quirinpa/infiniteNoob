"use strict";
// what if velocity comes from the middle of the cell?
module.exports = (N, m0s, v, dt) => {
	// m0s.push(v.x);
	// m0s.push(v.y);
	const ms = m0s.map(m0 => m0.map(val => 0));

	for (let y = 0; y < N; y++) {
		const yN = y * N;
		for (let x = 0; x < N; x++) {
			const idx = x + yN;
			// velocity
			const vx = v.x[idx];
			const vy = v.y[idx];
			// new position for value
			const px = x + vx * dt;
			const py = y + vy * dt;
			// surrounding points coordinates
			let x0 = Math.floor(px);
			let y0 = Math.floor(py);
			let x1 = x0 + 1;
			let y1 = y0 + 1;
			// coordinates in relation to top left corner
			const dx = px - x0;
			const dy = py - y0;
			// coordinate correction
			if (x0 < 0) x0 += N;
			else if (x0 >= N) x0 -= N;
			if (x1 < 0) x1 += N;
			else if (x1 >= N) x1 -= N;
			if (y0 < 0) y0 += N;
			else if (y0 >= N) y0 -= N;
			y0 *= N;
			if (y1 < 0) y1 += N;
			else if (y1 >= N) y1 -= N;
			y1 *= N;
			for (let i = 0; i < m0s.length; i++) {
				const m = ms[i];
				const m0 = m0s[i];
				const val = m0[idx];
				// amount that goes into the points at x0
				const vx0 = (1 - dx) * val;
				// amount that goes into the points at x1
				const vx1 = val - vx0;
				// POINTS A & C
				const vx0y0 = (1 - dy) * vx0;
				const vx0y1 = vx0 - vx0y0;
				// POINTS B & D
				const vx1y0 = (1 - dy) * vx1;
				const vx1y1 = vx1 - vx1y0;

				m[x0 + y0] += vx0y0;
				m[x0 + y1] += vx0y1;
				m[x1 + y0] += vx1y0;
				m[x1 + y1] += vx1y1;
			}
		}
	}

	return () => ms.shift();
};
