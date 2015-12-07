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

function diffuse(N, b, m, m0, diff, dt) {
	const a = dt * diff * N * N;
	for (let k = 0; k < 20; k++) {
		for (let i = 0; i < N; i++)
			for (let j = 0; j < N; j++)
				wSetSample(m, i, j,
					wSample(m0, i, j) + a * (
						wSample(m, i - 1, j) +
						wSample(m, i + 1, j) +
						wSample(m, i, j - 1) +
						wSample(m, i, j + 1)
					) / (1 + 4 * a)
				);
		// set_bnd(N, b, m);
	}
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
	// const tow = 0.0001;
	const step = y => y;
	// const noise = mDiamondSquare(size, [
	// 	[32, (p, c) => p + c * frand()],
	// 	[16, (p, c) => p + c * frand() * 2],
	// ]);
	const hs = heightMap.size()[0] / 2;
	return heightMap.map((value, index) => {
		const t = 1 - Math.abs(step(index[1] - hs)) / hs;
		return (1 - (value > waterlevel ? value : waterlevel)) * t;
	});
}

const io = require('./io');
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

// canvas.onClick(e => {
//
// });

const ctx = canvas.getContext('2d');
function setPixel(imageData, x, y, r, g, b, a) {
	let idx = (x + y * imageData.width) * 4;
	imageData.data[idx++] = r;
	imageData.data[idx++] = g;
	imageData.data[idx++] = b;
	imageData.data[idx] = a;
}
function draw(m, showWater, waterlevel) {
	const size = m.size()[0];
	const imageData = ctx.createImageData(size, size);

	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++) {
			const g = m.subset(mi(x, y));
			const gI = g * 255;
			setPixel(imageData, x, y, gI, gI,
				(showWater && g < waterlevel ?
					(1 - (waterlevel - g)) * 255 : gI), 255);
		}

	// ctx.fillStyle = "#FF0000";
	// ctx.fillRect(0, 0, size, size);
	ctx.putImageData(imageData, 0, 0);
}

// const mapPoint = {
// 	temperature, wind, humidity, cloud, height, rainfall
// }

function evaporate(watermap, pressure, airhumidity, tick) {
	const evapRate = math.multiply(normalize(math.multiply(pressure, 1)), tick);

	const evapWater = evapRate.map((value, index) => {
		return value * watermap.subset(mi(...index));
	});

	return {
		newWaterMap: math.subtract(
			watermap,
			evapWater
		),
		newAirHumidity: math.add(
			airhumidity,
			evapWater
		)
	};
}

function getWind(pressure) {
	const windX = math.zeros(mapSize, mapSize);
	const windY = math.zeros(mapSize, mapSize);
	for (let y = 0; y < mapSize; y++)
		for (let x = 0; x < mapSize; x++) {
			const a = wSample(pressure, x - 1, y - 1);
			const b = wSample(pressure, x, y - 1);
			const c = wSample(pressure, x + 1, y - 1);
			const d = wSample(pressure, x - 1, y);
			const e = wSample(pressure, x, y);
			const f = wSample(pressure, x + 1, y);
			const g = wSample(pressure, x - 1, y + 1);
			const h = wSample(pressure, x, y + 1);
			const i = wSample(pressure, x + 1, y + 1);
			const posXavg = (c + f + i) / 3;
			const negXavg = (a + d + g) / 3;
			const posYavg = (g + h + i) / 3;
			const negYavg = (a + b + c) / 3;
			// abc
			// def
			// ghi
			windX.subset(mi(x, y), posXavg - negXavg);
			windY.subset(mi(x, y), posYavg - negYavg);
		}
	return {x: windX, y: windY};
}

function drawWind(wind, negative) {
	const size = wind.x.size()[0];
	const imageData = ctx.createImageData(size, size);
	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++) {
			const wx = wind.x.subset(mi(x, y));
			const wy = wind.y.subset(mi(x, y));
			if (negative) {
				const gIr = wx < 0 ? - wx * 255 * 100 : 0;
				const gIb = wy < 0 ? - wy * 255 * 100 : 0;
				setPixel(imageData, x, y, gIr, 0, gIb, 255);
			} else {
				const gIr = wx > 0 ? wx * 255 * 100 : 0;
				const gIb = wy > 0 ? wy * 255 * 100 : 0;
				setPixel(imageData, x, y, gIr, 0, gIb, 255);
			}
		}
	ctx.putImageData(imageData, 0, 0);
}
// mat2 is an xy
function transport(mat1, d) {
	const size = mat1.size()[0];
	const result = math.zeros(size, size);
	mat1.forEach((value, index) => {
		const x = index[0];
		const y = index[1];
		const mat2valX = d.x.subset(mi(x, y));
		const mat2valY = d.y.subset(mi(x, y));
		const changeInX = mat2valX > 0 ? 1 : -1;
		const changeInY = mat2valY > 0 ? 1 : -1;
		const quantity = (Math.abs(mat2valX) + Math.abs(mat2valY));
		wSetSample(result, x, y, value - quantity);
		const v = wSample(result, x + changeInX, y + changeInY);
		wSetSample(result, x + changeInX, y + changeInY, v + quantity);
	});
	return result;
}
function advectForward(N, m, v, dt) {
	// const om = m.clone();
	const nm = math.zeros(N, N);

	m.forEach((val, index) => {
		const x = index[0];
		const y = index[1];
		// velocity
		const vx = v.x.subset(mi(x, y));
		const vy = v.y.subset(mi(x, y));
		// new position for value
		const px = x + vx * dt;
		const py = y + vy * dt;
		// surrounding points coordinates
		const x0 = Math.floor(px);
		const y0 = Math.floor(py);
		const x1 = x0 + 1;
		const y1 = y0 + 1;
		// coordinates in relation to top left corner
		const dx = px - x0;
		const dy = py - y0;
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

		wSetSample(nm, x0, y0,
			wSample(nm, x0, y0) + vx0y0);
		wSetSample(nm, x0, y1,
			wSample(nm, x0, y1) + vx0y1);
		wSetSample(nm, x1, y0,
			wSample(nm, x1, y0) + vx1y0);
		wSetSample(nm, x1, y1,
			wSample(nm, x1, y1) + vx1y1);
	});
	return nm;
}
// https://www.ibiblio.org/e-notes/webgl/gpu/advect.htm
// https://en.wikipedia.org/wiki/Bilinear_interpolation
// http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
// These causes are the three terms on the right hand
// side of the equal sign in the equation. The first term says that the density should follow the
// velocity field, the second states that the density may diffuse at a certain rate and the third term
// says that the density increases due to sources.
// advection + self-advection
// http://www.gamasutra.com/view/feature/1549/practical_fluid_dynamics_part_1.php?print=1
function blowWind(N, wind, airtemperature, airhumidity, dt) {
	return {
		newAirHumidity: advectForward(N, airhumidity, wind, dt),
		newAirTemperature: advectForward(N, airtemperature, wind, dt),
		newWind: {
			x: advectForward(N, wind.x, wind, dt),
			y: advectForward(N, wind.y, wind, dt)
		},
		// newAirHumidity: transport(airhumidity, wind),
		// newAirTemperature: transport(airtemperature, wind),
		// newWind: {x: transport(wind.x, wind), y: transport(wind.y, wind) },
	}
	// const newAirHumidity = airhumidity.map((value, index) => {
	// 	// console.log(index);
	// 	return value;
	// });
}

const $height = document.createElement('button');
$height.innerHTML = 'h';
canvasHolder.appendChild($height);
const $temperature = document.createElement('button');
$temperature.innerHTML = 't';
canvasHolder.appendChild($temperature);
const $watermap = document.createElement('button');
$watermap.innerHTML = 'w';
canvasHolder.appendChild($watermap);
canvasHolder.appendChild(document.createElement('br'));
const $windP = document.createElement('button');
$windP.innerHTML = 'w+';
canvasHolder.appendChild($windP);
const $windN = document.createElement('button');
$windN.innerHTML = 'w-';
canvasHolder.appendChild($windN);
const $airhumidity = document.createElement('button');
$airhumidity.innerHTML = 'ah';
canvasHolder.appendChild($airhumidity);
const $airTemperature = document.createElement('button');
$airTemperature.innerHTML = 'at';
canvasHolder.appendChild($airTemperature);
canvasHolder.appendChild(document.createElement('br'));
const $blowWind = document.createElement('button');
$blowWind.innerHTML = 'blow';
canvasHolder.appendChild($blowWind);
// console.log(float);
function createMap(size, waterlevel) {
	const height = mDiamondSquare(size, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 0.3],
		[8, (p, c) => p + c * frand() * 0.1],
		// [16, (p, c) => p + c * frand() * 0.05],
	]);

	const temperature = temperatureMap(height, waterlevel); // pressure
	let airTemperature = temperature;

	let watermap = math.zeros(size, size);
	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++) {
			const h = height.subset(mi(x, y));
			watermap.subset(mi(x, y),
				h <= waterlevel ? waterlevel - h : 0);
		}

	draw(height);

	let airHumidity = math.zeros(size, size);
	const evap = evaporate(watermap, temperature, airHumidity, 0.3);
	airHumidity = normalize(evap.newAirHumidity);
	watermap = normalize(evap.newWaterMap);

	let wind = getWind(temperature);
	advectForward(size, airHumidity, wind, 70);
	// blowWind(wind, airTemperature, airHumidity, 1);

	$height.onclick = () => draw(height, 1, waterlevel);
	$airhumidity.onclick = () => draw(airHumidity);
	$temperature.onclick = () => draw(temperature);
	$watermap.onclick = () => draw(watermap);
	$windP.onclick = () => drawWind(wind);
	$windN.onclick = () => drawWind(wind, true);
	$airTemperature.onclick = () => draw(airTemperature);
	$blowWind.onclick = () => {
		const bw = blowWind(size, wind, airTemperature, airHumidity, 100);
		airTemperature = bw.newAirTemperature;
		airHumidity = bw.newAirHumidity;
		wind = bw.newWind;
		// airHumidity = advectForward(size, airHumidity, wind, 100);
	};
	// draw(height, 1, waterlevel);
	// blowWind(getWind(pressure), )

	// draw(height, 1);
	// draw(temperature);
}
const map = createMap(128, 0.5);
// Assuming, there is currently no wind (not a solid assumption),
// temperature is either directly or inversely proportional
// (depending if we are talking surface or high-altitude) to pressure.
// This is due to the equation PV = nRT. n, R and V are roughly proportional.
// function takeInitialPressure(temperature) {
//
// }
//
// const pressureMap = takePressure(temperature);
