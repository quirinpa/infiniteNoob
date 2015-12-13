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

// https://en.wikipedia.org/wiki/Air_mass
// go back to viscosity/otherthing
const getSlope = require('./getSlope');
const normalize = require('./normalize');
module.exports = (N, m, dt, diff) => {
	const tForceHorse = 5;
	const t = getSlope(N, m.t.map((val, idx) => {
		const w = m.w[idx];
		const h = m.h[idx];

		return val * (-m.at[idx] * 0.2) - ((h - w > 0 ? (h - w) * 5 : h));
		// return val;
	}));
	m.wi = {
		x: m.wi.x.map((val, idx) => val + dt * 0.5 * tForceHorse * t.x[idx]),
		y: m.wi.y.map((val, idx) => val + dt * 0.5 * tForceHorse * t.y[idx])
	};
	const d = diffuse(N, [m.at, m.ah, m.wi.x, m.wi.y], diff, dt * 0.5);
	const a = advectForward(N, [d(), d()], {x: d(), y: d()}, dt * 0.5);
	m.at = a();
	// https://en.wikipedia.org/wiki/Balanced_flow#Antitriptic_flow
	m.ah = a();
	m.wi = { x: a(), y: a() };
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
