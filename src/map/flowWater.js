"use strict";
const wSpeed = 1;
const nNeighbors = 2;

// function getQuantity(h1, w1, h2, w2) {
// 	const t1 = h1 + w1;
// 	const t2 = h2 + w2;
// 	const difference = t1 - t2;
// 	const
// 	// const amount = difference / 2;
// 	if (difference > 0) {
// 		const flow = t2 / t1;
// 		return -flow * w1;
// 	} else {
// 		const flow = t1 / t2;
// 		return flow * w1;
// 	}
// }

function clamp(v, loLimit, hiLimit) {
	if (v < loLimit) return loLimit;
	else if (v > hiLimit) return hiLimit;
	return v;
}

function getQuantity(h1, w1, h2, w2) {
	const t1 = h1 + w1;
	const t2 = h2 + w2;
	// const diffn = (t2 - t1) / nNeighbors;
	// return clamp(
	// 	difference / nNeighbors,
	// 	w1 / nNeighbors,
	// 	-w2 / nNeighbors
	// );
	const rw = (t2 + w1) - h1;
	const share = rw / nNeighbors;
	return share;
}

// module.exports = (N, w, h, dt) => {
// 	const r = new Array(N * N);
// 	// const a = dt * wSpeed;
// 	// const b = 1 + 4 * a;
// 	for (let y = 0; y < N; y++) {
// 		const yN = y * N;
// 		// const y0N = (y === 0 ? N - 1 : y - 1) * N;
// 		// const y1N = (y === N - 1 ? 0 : y + 1) * N;
// 		for (let x = 0; x < N; x += 2) {
// 			// const x0 = x === 0 ? N - 1 : x - 1;
// 			const x1 = x === N - 1 ? 0 : x + 1;
// 			const h1 = h[x + yN];
// 			const w1 = w[x + yN];
// 			const h2 = h[x1 + yN];
// 			const w2 = w[x1 + yN];
//
// 			const nw1 = getQuantity(h1, w1, h2, w2);
// 			r[x + yN] = nw1;
// 			r[x1 + yN] = w2 + (w1 - nw1);
// 		}
// 	}
// 	return r;
// };
function velForce(a, b, dt) {
	return {
		x: a.x.map((v, i) => v + b.x[i] * dt),
		y: a.y.map((v, i) => v + b.y[i] * dt),
	}
}
const advectForward = require('./advectForward');
const diffuse = require('./gs-diffusion');
const getSlope = require('./getSlope');
module.exports = (N, m, dt, wl) => {
	const tForceHorse = 5;
	// const sum0 = m.w.reduce((r, v) => r + v, 0);
	// const addV = getSlope(N, m.h.map(v => -v));
	// m.wv.x = m.wv.x.map((v, i) => v + addV.x[i] * dt);
	// m.wv.y = m.wv.y.map((v, i) => v + addV.y[i] * dt);
	// console.log(sum0);
	// const s = {
	// 	x: (new Array(N * N)).fill(0),
	// 	y: (new Array(N * N)).fill(0)
	// };
	// const addV = getSlope(N, m.h.map((v, i) => v > wl ? (wl - v) : 0));
	// m.wv = velForce(m.wv, addV, dt);
	const d = diffuse(N, [m.w], 0.5, dt);
	// console.log(pnw.reduce((r, v) => r + v, 0));
	const a = advectForward(N, [d()], m.wv, dt);
	m.w = a();
	// m.wv.x = a();
	// m.wv.y = a();
	// const nw = a();
	// console.log(nw.reduce((r, v) => r + v, 0));
	// neither diffuse or advectForward is mass-conserving
	// debugger;
	// return nw;
};
