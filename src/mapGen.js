"use strict";
const mapSize = 128;
const waterLevel = 0.5;
const math = require('mathjs');
const mi = math.index;

function profile() {
	const start = (new Date()).getTime();
	return () => console.log('took', (new Date()).getTime() - start, 'ms');
}

function frand() {
	return Math.random() * 2 - 1;
}

function wrapVal(val, size) {
	if (val >= size) return val - size;
	else if (val < 0) return val + size;
	return val;
}

function wrapCoords(x, y, size) {
	const rx = wrapVal(x, size);
	const ry = wrapVal(y, size);
	return [rx, ry];
}

function wSample(m, x, y) {
	const size = m.size()[0];
	return m.subset(mi(...wrapCoords(x, y, size)));
}

function wSetSample(m, x, y, val) {
	const size = m.size()[0];
	m.subset(mi(...wrapCoords(x, y, size)), val);
}

function normalize(m) {
	const firstVal = wSample(m, 0, 0);
	let min = firstVal;
	let max = firstVal;
	m.forEach(value => {
		if (value < min) min = value;
		if (value > max) max = value;
	});
	return math.divide(math.add(m, -min), max - min);
}

// import {question} from './interaction';
function mDiamondSquare(size, _steps) {
	const m = math.zeros(size, size);
	const firstStepSize = _steps[0][0];
	const steps = _steps.map(v => ({
		scale: 1 - (v[0] / firstStepSize),
		f: v[1],
	}));

	// randomize initial values
	const firstHalfStep = firstStepSize / 2;
	for (let y = 0; y < size; y += firstStepSize) {
		for (let x = 0; x < size; x += firstStepSize) {
			wSetSample(m, x, y, frand());
			wSetSample(m, x + firstStepSize, y, frand());
			wSetSample(m, x, y + firstStepSize, frand());
			wSetSample(m, x + firstStepSize, y + firstStepSize, frand());
			wSetSample(m, x + firstHalfStep, y + firstHalfStep, frand());
			wSetSample(m, x + firstHalfStep, y - firstHalfStep, frand());
			wSetSample(m, x - firstHalfStep, y + firstHalfStep, frand());
		}
	}

	let stepSize = firstStepSize;
	let scaleMod = 1;
	// let scale = _scale;

	do {
		const halfStep = stepSize / 2;
		// const stepScale = stepSize * scale;

		for (let y = 0; y < size; y += stepSize) {
			for (let x = 0; x < size; x += stepSize) {
				const a = wSample(m, x, y);
				const b = wSample(m, x + stepSize, y);
				const c = wSample(m, x, y + stepSize);
				const d = wSample(m, x + stepSize, y + stepSize);

				const avg = (a + b + c + d) / 4.0;
				let e = avg
				// console.log('b', e);
				for (let i = 0; i < steps.length; i++)
					e = steps[i].f(e, steps[i].scale, avg, x, y); // e = steps[i](e, stepScale, x, y);
				// console.log(e);

				wSetSample(m, x + halfStep, y + halfStep, e);
			}
		}

		// debug only!!!
		// saveGrey(normalize(m), 'hstep' + stepSize + '.jpg');

		// const halfStepScale = stepScale * 0.5;

		for (let y = 0; y < size; y += stepSize) {
			for (let x = 0; x < size; x += stepSize) {
				const a = wSample(m, x, y);
				const b = wSample(m, x + stepSize, y);
				const c = wSample(m, x, y + stepSize);
				const d = wSample(m, x + halfStep, y + halfStep);
				const e = wSample(m, x + halfStep, y - halfStep);
				const f = wSample(m, x - halfStep, y + halfStep);

				const avgH = (a + b + d + e) / 4.0;
				const avgG = (a + c + d + f) / 4.0;
				let H = avgH;
				let G = avgG;

				for (let i = 0; i < steps.length; i++) {
					H = steps[i].f(H, steps[i].scale * 0.5, avgH, x, y);
					G = steps[i].f(G, steps[i].scale * 0.5, avgG, x, y);
				}

				wSetSample(m, x + halfStep, y, H);
				wSetSample(m, x, y + halfStep, G);
			}
		}
		// debug only!!
		// saveGrey(normalize(m), 'step' + stepSize + '.jpg');
		// question(stepSize);

		stepSize /= 2;
		scaleMod *= 0.3;

		for (let i = 0; i < steps.length; i++)
			steps[i].scale *= scaleMod + 0.8;

	} while (stepSize > 1);
	return normalize(m);
}

// function trunc(m, tval, cond = (v, t) => v < t) {
// 	const size = m.size()[0];
// 	const result = math.zeros(size, size);
// 	for (let y = 0; y < size; y++)
// 		for (let x = 0; x < size; x++) {
// 			const val = m.subset(mi(x, y));
// 			result.subset(mi(x, y), cond(val, tval) ? tval : val);
// 		}
// 	return result;
// }

function selectCoords(m, comp) {
	const result = [];
	m.forEach((value, index) => {
		if (comp(value, index))
			result.push([value, index]);
	});
	return result;
}
// http://www.tophatstuff.co.uk/index.html@p=93.html
// https://en.wikipedia.org/wiki/Numerical_weather_prediction#/media/File:NOAA_Wavewatch_III_Sample_Forecast.gif
// http://www.dungeonleague.com/2010/03/28/wind-direction/
// Assuming, there is currently no wind (not a solid assumption), temperature is either directly or inversely proportional (depending if we are talking surface or high-altitude) to pressure. This is due to the equation PV = nRT. n, R and V are roughly proportional.
// And thus, it good initial value for making a good pressure map.
// For successive iterations, you would likely need to incorporate wind into pressure calculations to compensate for the assumption above.
// edit: as a source for temp -> pressure: The Climate Cookbook
// http://web.archive.org/web/20130619132254/http://jc.tech-galaxy.com/bricka/climate_cookbook.html
// relation between the difference of land and water temperature over the water temperature and the waterLevel

function blur(m) {
	const size = m.size()[0];
	const res = math.zeros(size, size);
}

function temperatureMap(heightMap, waterlevel) {
	const tow = 0.0001;
	const step = y => y;
	const size = heightMap.size()[0];
	const noise = mDiamondSquare(size, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 2],
		// [8, (p, c) => p + c * frand() * 0.4],
	]);
	// debug only!!
	// save(noise, 'temp_noise.jpg');

	const m = math.zeros(size, size);

	const wTemp = waterlevel - tow * 0.5;
	const lMult = 1 - (waterlevel - tow * 0.5);

	const doForY = (x, y, t) => {
		const height = heightMap.subset(mi(x, y));
		const lTemp = (1 - lMult * height);
		m.subset(mi(x, y), (
			t * (height < waterlevel ? wTemp : lTemp)// +
			// 1 - 0.001 * noise.subset(mi(x, y))
		));
	};
	const hs = size / 2;
	for (let y = 0; y < hs; y++) {
		const t = 1 - step(y / hs);
		for (let x = 0; x < size; x++) {
			doForY(x, hs - y, t);
			doForY(x, hs + y, t);
		}
	}
	return m;
}

const io = require('./io');
const canvas = document.createElement('canvas');
io.setStyle(canvas, {
	position: 'absolute',
	right: '10px',
	top: '10px',
	outline: 'solid thin cyan',
	opacity: '0.7',
});
canvas.height = canvas.width = mapSize;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
function setPixel(imageData, x, y, r, g, b, a) {
	let idx = (x + y * imageData.width) * 4;
	imageData.data[idx++] = r;
	imageData.data[idx++] = g;
	imageData.data[idx++] = b;
	imageData.data[idx] = a;
}
function draw(m, showWater) {
	const size = m.size()[0];
	const imageData = ctx.createImageData(size, size);

	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++) {
			const g = m.subset(mi(x, y));
			const gI = g * 255;
			setPixel(imageData, x, y, gI, gI,
				(showWater && g < waterLevel ?
					(1 - (waterLevel - g)) * 255 : gI), 255);
		}

	// ctx.fillStyle = "#FF0000";
	// ctx.fillRect(0, 0, size, size);
	ctx.putImageData(imageData, 0, 0);
}

// console.log('init');
// const stop = profile();
const height = mDiamondSquare(mapSize, [
	[32, (p, c) => p + c * frand()],
	[16, (p, c) => p + c * frand() * 0.3],
	[8, (p, c) => p + c * frand() * 0.1],
	// [16, (p, c) => p + c * frand() * 0.05],
]);
// stop2();

// draw(height, 1);
const temperature = temperatureMap(height, waterLevel);
draw(temperature);

// Assuming, there is currently no wind (not a solid assumption),
// temperature is either directly or inversely proportional
// (depending if we are talking surface or high-altitude) to pressure.
// This is due to the equation PV = nRT. n, R and V are roughly proportional.
// function takeInitialPressure(temperature) {
//
// }
//
// const pressureMap = takePressure(temperature);
