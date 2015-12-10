"use strict";
const mapSize = 128;

const io = require('../io');

const canvasHolder = document.createElement('div');
io.setStyle(canvasHolder, {
	position: 'absolute',
	right: '10px',
	top: '10px',
});
document.body.appendChild(canvasHolder);

const canvas = document.createElement('canvas');
io.setStyle(canvas, {
	outline: 'solid thin cyan',
});
canvas.height = canvas.width = mapSize;
canvasHolder.appendChild(canvas);

canvasHolder.appendChild(document.createElement('br'));

const ctx = canvas.getContext('2d');

// layer:
//  val => rgba[]
function rHelper(N, cb) {
	const imageData = ctx.createImageData(N, N);
	const r = imageData.data;

	for (let y = 0; y < N; y++) {
		const yN = y * N;
		for (let x = 0; x < N; x++) {
			let idx = x + yN;
			const c = cb(idx, x, y);
			idx *= 4;

			r[idx++] = c[0] * 255;
			r[idx++] = c[1] * 255;
			r[idx++] = c[2] * 255;
			r[idx] = c[3] * 255;
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

const render = (N, m) => rHelper(N, idx => {
	const g = m[idx];
	return [g, g, g, 1];
});

const renderVelocities = (N, v) => rHelper(N, idx => {
	const vx = v.x[idx];
	const vy = v.y[idx];
	return [
		(vx + 1) / 2,
		0,
		(vy + 1) / 2,
		255,
	];
});

const screen = (a, b) => 1 - (1 - a) * (1 - b);
const overlay = (a, b) => a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
const renderFull = (N, m) => rHelper(N, idx => {
	const h = m.h[idx];
	const w = m.w[idx];
	const ah = m.ah[idx];
	return [
		screen(h, ah),
		0.5 + screen(h, ah) * 0.5,
		screen(w, ah),
		255
	];
});

const btns = document.createElement('div');
btns.id = 'btns';
function addButton(label, cb) {
	const btn = document.createElement('div');
	btn.className = 'flexButton';
	btn.innerHTML = label;
	btn.onclick = cb;
	btns.appendChild(btn);
}
canvasHolder.appendChild(btns);

const frand = require('./frand');
const diamondSquare = require('./diamondSquare');
const temperatureMap = require('./temperatureMap');
const evaporate = require('./evaporate');
const getInitialWind = require('./getInitialWind');
const advectForward = require('./advectForward');
const blowWind = require('./blowWind');
// const normalize = require('./normalize');
function createMap(N, wl) {
	const h = diamondSquare(N, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 0.3],
		[8, (p, c) => p + c * frand() * 0.1],
	]);

	const t = temperatureMap(N, h, wl); // also pressure?
	const p = t;
	let at = t;

	let w = h.map(val => val <= wl ? wl - val : 0); // water on the map
	let ah = (new Array(N * N)).fill(0);
	let wi = getInitialWind(N, p, 100);

	let cm = 'fu';
	const m = {h, ah, t, w, at, wi};
	addButton('fu', () => cm = 'fu');
	addButton('h', () => cm = 'h');
	addButton('t', () => cm = 't');
	addButton('w', () => cm = 'w');
	addButton('wi', () => cm = 'wi');
	addButton('ah', () => cm = 'ah');
	addButton('at', () => cm = 'at');

	let lastTick = (new Date()).getTime();
	const step = () => {
		const newTick = (new Date()).getTime();
		const dt = (newTick - lastTick) * 0.001;
		lastTick = newTick;
		const sunWarmness = 1;
		const evapRate = 0.001;
		const airDiffusion = 0.5;

		// heat air
		// fails due to me not realising the need for backward advocation (i think)
		// m.at = m.at.map((val, idx) =>
		// 	val + dt * sunWarmness * t[idx]);

		evaporate(m, dt, evapRate);
		blowWind(N, m, dt, airDiffusion);

		if (cm === 'wi')
			renderVelocities(N, m.wi);
		else if (cm === 'fu')
			renderFull(N, m);
		else render(N, m[cm]);

		requestAnimationFrame(step);
	};
	step();
}

const map = createMap(mapSize, 0.2);
