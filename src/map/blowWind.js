"use strict";
const advectForward = require('./advectForward');
module.exports = (N, wi, at, ah, dt) => ({
	ah: advectForward(N, ah, wi, dt),
	at: advectForward(N, at, wi, dt),
	wi: {
		x: advectForward(N, wi.x, wi, dt),
		y: advectForward(N, wi.y, wi, dt)
	},
});

// https://www.ibiblio.org/e-notes/webgl/gpu/advect.htm
// https://en.wikipedia.org/wiki/Bilinear_interpolation
// http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
// These causes are the three terms on the right hand
// side of the equal sign in the equation. The first term says that the density should follow the
// velocity field, the second states that the density may diffuse at a certain rate and the third term
// says that the density increases due to sources.
// advection + self-advection
// http://www.gamasutra.com/view/feature/1549/practical_fluid_dynamics_part_1.php?print=1
