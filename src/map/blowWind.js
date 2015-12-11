"use strict";
const advectForward = require('./advectForward');
const diffuse = require('./gs-diffusion');
// // Apply the first 3 operators in Equation 12.
// u = advect(u);
// u = diffuse(u);
// u = addForces(u);
// // Now apply the projection operator to the result.
// p = computePressure(u);
// u = subtractPressureGradient(u, p);
const getSlope = require('./getSlope');
const normalize = require('./normalize');
module.exports = (N, m, dt, diff) => {
	// add forces - diffuse - move
	// const d = diffuse(N, adv, diff, dt);
	const d = diffuse(N, [m.at, m.ah, m.wi.x, m.wi.y], diff, dt);
	// const adv = advectForward(N, [m.at, m.ah], nw, dt);
	const a = advectForward(N, [d(), d()], {x: d(), y: d()}, dt);
	m.at = a();
	m.ah = a();

	const tForceHorse = 1;
	const t = getSlope(N, m.t.map((val, idx) => {
		const w = m.w[idx];
		const h = m.h[idx];

		return val - (h - w > 0 ? (h - w) * 5 : 0) - m.at[idx] + m.t[idx] * 2;
	}));
	// t.x = normalize(t.x).map(val => val * dt * tForceHorse);
	// t.y = normalize(t.y).map(val => val * dt * tForceHorse);
	m.wi = {
		x: a().map((val, idx) => val + dt * tForceHorse * t.x[idx]),
		y: a().map((val, idx) => val + dt * tForceHorse * t.y[idx])
	};

	// m.at = d[0];
	// m.ah = d[1];
	// m.wi = {
	// 	x: d[2],
	// 	y: d[3]
	// };
};

// https://www.ibiblio.org/e-notes/webgl/gpu/advect.htm
// https://en.wikipedia.org/wiki/Bilinear_interpolation
// http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
// These causes are the three terms on the right hand
// side of the equal sign in the equation. The first term says that the density should follow the
// velocity field, the second states that the density may diffuse at a certain rate and the third term
// says that the density increases due to sources.
// advection + self-advection
// http://www.gamasutra.com/view/feature/1549/practical_fluid_dynamics_part_1.php?print=1
