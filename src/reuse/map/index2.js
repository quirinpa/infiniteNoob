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
// const multiply = (a, b) => a * b;
// const screen = (a, b) => 1 - (1 - a) * (1 - b);
// const overlay = (a, b) => a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
// const pegtop = (a, b) => (1 - 2 * b) * a * a + 2 * b * a;
const renderFull = (N, m) => rHelper(N, idx => {
	const h = m.h[idx];
	const w = m.w[idx];
	const ah = m.ah[idx];
	let il = m.s[idx];
	if (il < 0) il = 0;
	const s = 0.2 + (il < 0 ? 0 : il) * 0.8;
	// const s = 1;
	// const w0 = (w ? 0 : h);
	const clouds = ah * (0.2 + s * 0.8);
	return [
		s * h * 0.5 + clouds,
		s * h + clouds,
		// s * w * 2 + clouds,
		(w > 0.001 ? 0.5 + w * 0.5 : 0) + clouds,
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
// const evaporate = require('./evaporate');
// const getInitialWind = require('./getInitialWind');
// const advectForward = require('./advectForward');
// const blowWind = require('./blowWind');
// const copyM = require('./copyM');
const calcSun = require('./sun');
const getSlope = require('./getSlope');
// const condensate = require('./condensate');
const flowWater = require('./flowWater');
const normalize = require('./normalize');
const constants = require('./constants');
const biome = {
	snow: 'white', tundra: '#DDDDBB', bare: '#BBBBBB', scorched: '#999999',
	taiga: '#CCD4BB', shrubland: '#C4CCBB', temperateDesert: '#E4E8CA',
	temperateRainForest: '#A4C4A8', temperateDecidiousForest: '#B4C9A9',
	grassland: '#C4D4AA', tropicalRainForest: '#9CBBA9',
	tropicalSeasonalForest: '#A9CCA4', subtropicalDesert: '#E9DDC7',
};
// http://delvelord.blogspot.pt/2015_01_01_archive.html
function getBiome(t, m) {
	if (t < 1/4) {
		if (m > 3/6) return biome.snow;
		if (m > 2/6) return biome.tundra;
		if (m > 1/6) return biome.bare;
		return biome.scorched;
	}
	if (t < 2/4) {
		if (m > 4/6) return biome.taiga;
		if (m > 2/6) return biome.shrubland;
		return biome.temperateDesert;
	}
	if (t < 3/4) {
		if (m > 5/6) return biome.temperateRainForest;
		if (m > 3/6) return biome.temperateDecidiousForest;
		if (m > 1/6) return biome.grassland;
		return biome.temperateDesert;
	}
	if (m > 4/6) return biome.tropicalRainForest;
	if (m > 2/6) return biome.tropicalSeasonalForest;
	if (m > 1/6) return biome.grassland;
	return biome.subtropicalDesert;
}

function createMap(N, wl) {
	let cm = 'fu';

	addButton('fu', () => cm = 'fu');
	addButton('h', () => cm = 'h');
	addButton('t', () => cm = 't');
	addButton('m', () => cm = 'm');
	addButton('s', () => cm = 's');
	addButton('w', () => cm = 'w');
	addButton('wi', () => cm = 'wi');
	addButton('wv', () => cm = 'wv');
	addButton('ah', () => cm = 'ah');
	addButton('at', () => cm = 'at');
	addButton('h+w', () => cm = 'h+w');
	addButton('b', () => cm = 'b');

	const h = normalize(diamondSquare(N, [
		[64, (p, c) => p + c * frand()],
		[32, (p, c) => p + c * frand() * 0.5],
		[16, (p, c) => p + c * frand() * 0.01],
		[8, (p, c) => p + c * frand() * 0.001],
	]));

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
		wv: getSlope(N, h.map((v, i) => - v - w[i]), 10),
		ah: zeros,
		t: t,
		p: avgTemp,
		at: avgTemp,
		ct: avgTemp,
		wi: getSlope(N, t.map((val, idx) => val - h[idx] * 10), 100),
		m: (() => {
			const mr = normalize(diamondSquare(N, [
				[64, (p, c) => p + c * frand()],
				[32, (p, c) => p + c * frand() * 0.5],
				[16, (p, c) => p + c * frand() * 0.25],
				[8, (p, c) => p + c * frand() * 0.125],
			]));

			const iwl = 1 - wl;
			return normalize(mr.map((v, i) => {
				const rh = h[i];
				// return wl > rh ? 1 : ((1 - (rh - wl)) - v) - (1 - t[i]);
				return wl > rh ? 1 : (1 - (rh - wl) / iwl) * (0.8 + mr[i] * 0.2);
			}));
		})(),
	};
	m.b = h.map((v, i) => v > wl ? getBiome(t[i], m.m[i]) : 'rgba(200, 200, 255, 0.5)');

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
		const temp = m.s.map(il =>
			dt * il * constants.daysPerTick * 1);
		m.t = m.t.map((val, idx) => val + temp[idx]);
		m.at = m.at.map((val, idx) => val + temp[idx]);
		// evaporate(m, dt);
		// condensate(m, dt, 1);
		// m.wv = getSlope(N, m.h.map((v, idx) => -v - m.w[idx]), 10);
		flowWater(N, m, dt);
		// blowWind(N, m, dt, 1);

		switch (cm) {
		case 'wi':
		case 'wv':
			renderVelocities(N, m[cm]);
			break;
		case 'fu':
			renderFull(N, m);
			for (let y = 0; y < N; y++) {
				const yN = y * N;
				for (let x = 0; x < N; x++) {
					ctx.fillStyle = m.b[x + yN];
					ctx.fillRect( x, y, 1, 1);
				}
			}
			break;
		case 't':
		case 'at':
		case 's':
		case 'm':
		// case 'st':
			renderTemperature(N, m[cm]);
			break;
		case 'h+w':
			render(N, m.w.map((v, idx) => v + m.h[idx]));
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

createMap(mapSize, 0.5);
