"use strict";
const mapSize = 128;

const io = require('../io');

const canvasHolder = document.createElement('div');
io.setStyle(canvasHolder, {
	position: 'absolute',
	right: '0',
	top: '0',
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
		1,
	];
});

const renderTemperature = (N, t) => rHelper(N, idx => {
	return [
		t[idx],
		0,
		1 - t[idx],
		1
	]
});

// https://en.wikipedia.org/wiki/Blend_modes
const multiply = (a, b) => a * b;
const screen = (a, b) => 1 - (1 - a) * (1 - b);
const overlay = (a, b) => a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
const pegtop = (a, b) => (1 - 2 * b) * a * a + 2 * b * a;
const renderFull = (N, m) => rHelper(N, idx => {
	const h = m.h[idx];
	const w = m.w[idx];
	const ah = m.ah[idx];
	let il = m.s[idx];
	if (il < 0) il = 0;
	const s = 0.2 + (il < 0 ? 0 : il) * 0.8;
	// const s = 1;
	const w0 = (w ? 0 : h);
	const clouds = ah * (0.2 + s * 0.8);
	return [
		s * h * 0.5 + clouds,
		s * h + clouds,
		s * w + clouds,
		1
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
const copyM = require('./copyM');
const calcSun = require('./sun');
const getSlope = require('./getSlope');
const condensate = require('./condensate');
const flowWater = require('./flowWater');
// const normalize = require('./normalize');
function createMap(N, wl) {
	let cm = 'fu';

	addButton('fu', () => cm = 'fu');
	addButton('h', () => cm = 'h');
	addButton('t', () => cm = 't');
	addButton('s', () => cm = 's');
	addButton('w', () => cm = 'w');
	addButton('wi', () => cm = 'wi');
	addButton('wv', () => cm = 'wv');
	addButton('ah', () => cm = 'ah');
	addButton('at', () => cm = 'at');

	const h = diamondSquare(N, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 0.1],
		[8, (p, c) => p + c * frand() * 0.01],
	]);

	const t = temperatureMap(N, h, wl); // also pressure?

	// sun position/temperature
	const averageTemperature = 0.5;
	let lastTick = (new Date()).getTime();
	const zeros = (new Array(N * N)).fill(0);
	const avgTemp = (new Array(N * N))
		.fill(averageTemperature);
	const w = h.map(val => val <= wl ? wl - val : 0);
	const m = {
		h,
		w,
		wv: getSlope(N, h.map(v => v > wl ? (wl - v)*300 : 0)),
		ah: zeros,
		t: t,
		p: avgTemp,
		at: avgTemp,
		ct: avgTemp,
		wi: getSlope(N, t.map((val, idx) => {
			return val - h[idx] * 10;
		}))
	};

	canvas.onclick = e => {
		const r = e.target.getBoundingClientRect();
		const x = Math.round(e.clientX - r.left);
		const y = Math.round(e.clientY - r.top);
		m.w[x + y * N] += 2;
	};
	const step = i => {
		const newTick = (new Date()).getTime();
		const dt = (newTick - lastTick) * 0.001;
		lastTick = newTick;
		m.s = calcSun(N, dt);
		const temp = m.s.map((il, idx) => dt * il * 0.05);
		m.t = m.t.map((val, idx) => val + temp[idx]);
		m.at = m.at.map((val, idx) => val + temp[idx]);
		// evaporate(m, dt);
		// m.w = flowWater(N, m, dt);
		flowWater(N, m, dt, wl);
		// condensate(m, dt, 1);
		// blowWind(N, m, dt, 1);

		switch (cm) {
		case 'wi':
		case 'wv':
			renderVelocities(N, m[cm]);
			break;
		case 'fu':
			renderFull(N, m);
			break;
		case 't':
		case 'at':
		case 's':
		// case 'st':
			renderTemperature(N, m[cm]);
			break;
		default:
			render(N, m[cm]);
		}

		ctx.font = "10px Arial";
		ctx.fillStyle = "red";
		ctx.fillText("w:" + Math.round(m.w.reduce((r, v) => r + v, 0)), 10, 10);
		ctx.fillText("ah:" + Math.round(m.ah.reduce((r, v) => r + v, 0)), 10, 20);
		requestAnimationFrame(() => step(i + 1));
	};
	step(0);
}

const map = createMap(mapSize, 0.1);
