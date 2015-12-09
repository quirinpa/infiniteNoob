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
	opacity: '0.7',
});
canvas.height = canvas.width = mapSize;
canvasHolder.appendChild(canvas);

canvasHolder.appendChild(document.createElement('br'));

const ctx = canvas.getContext('2d');

function render(N, m, wl) {
	const imageData = ctx.createImageData(N, N);
	const r = imageData.data;

	for (let y = 0; y < N; y++) {
		const yN = y * N;
		for (let x = 0; x < N; x++) {
			let idx = x + yN;
			const g = m[idx];
			const gI = g * 255;
			idx *= 4;

			r[idx++] = gI;
			r[idx++] = gI;
			r[idx++] = wl && g < wl ? (1 - (wl - g)) * 255 : gI;
			r[idx] = 255;
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

function renderVelocities(N, v, neg) {
	const imageData = ctx.createImageData(N, N);
	const r = imageData.data;
	const m = 255;

	for (let y = 0; y < N; y++) {
		const yN = y * N;
		for (let x = 0; x < N; x++) {
			let idx = x + yN;
			const vx = v.x[idx];
			const vy = v.y[idx];
			idx *= 4;

			r[idx++] = (vx + 1) * m / 2;
			r[idx++] = 0;
			r[idx++] = (vy + 1) * m / 2;
			r[idx] = 255;
		}
	}

	ctx.putImageData(imageData, 0, 0);
}

const $h = document.createElement('button');
$h.innerHTML = 'h';
canvasHolder.appendChild($h);

const $t = document.createElement('button');
$t.innerHTML = 't';
canvasHolder.appendChild($t);

const $w = document.createElement('button');
$w.innerHTML = 'w';
canvasHolder.appendChild($w);

canvasHolder.appendChild(document.createElement('br'));

const $wi = document.createElement('button');
$wi.innerHTML = 'wi';
canvasHolder.appendChild($wi);

const $ah = document.createElement('button');
$ah.innerHTML = 'ah';
canvasHolder.appendChild($ah);

const $at = document.createElement('button');
$at.innerHTML = 'at';
canvasHolder.appendChild($at);

canvasHolder.appendChild(document.createElement('br'));

// const $blowWind = document.createElement('button');
// $blowWind.innerHTML = 'blow';
// canvasHolder.appendChild($blowWind);

const frand = require('./frand');
const diamondSquare = require('./diamondSquare');
const temperatureMap = require('./temperatureMap');
const evaporate = require('./evaporate');
const getInitialWind = require('./getInitialWind');
const advectForward = require('./advectForward');
const blowWind = require('./blowWind');

function createMap(N, wl) {
	const h = diamondSquare(N, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 0.3],
		[8, (p, c) => p + c * frand() * 0.1],
	]);

	const t = temperatureMap(N, h, wl); // also pressure?
	let at = t; // air temperature

	// render(N, h);
	let w = h.map(val => val <= wl ? wl - val : 0); // water on the map
	let ah = (new Array(N * N)).fill(0);
	let wi = getInitialWind(N, t, 100);

	let cm = 'ah';
	const m = {h, ah, t, w, at, wi};
	$h.onclick = () => cm = 'h';
	$ah.onclick = () => cm = 'ah';
	$t.onclick = () => cm = 't';
	$w.onclick = () => cm = 'w';
	$wi.onclick = () => cm = 'wi';
	$at.onclick = () => cm = 'at';

	let lastTick = (new Date()).getTime();
	const step = () => {
		const newTick = (new Date()).getTime();
		const dt = (newTick - lastTick) * 0.001;
		lastTick = newTick;

		evaporate(m, dt);
		blowWind(N, m, dt, 100);

		if (cm === 'wi')
			renderVelocities(N, m.wi);
		else render(N, m[cm]);

		// setTimeout(step, 1000);
		requestAnimationFrame(step);
	};

	step();
}

const map = createMap(mapSize, 0.2);
