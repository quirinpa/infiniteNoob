const waterLevel = 0.5;

// http://www.bluh.org/code-the-diamond-square-algorithm/
import math from 'mathjs';

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

import Jimp from 'jimp';
function save(m, path, showWater = false) {
	const size = m.size();
	(new Jimp(size[0], size[1], function(err, image) {
		const renderPix = showWater ? (g, idx) => {
			if (g < waterLevel) {
				for (let i = 0; i < 2; i++)
					image.bitmap.data[idx + i] = g * 255;
				image.bitmap.data[idx + 2] = (1 - (waterLevel - g)) * 255;
				return;
			}

			for (let i = 0; i < 3; i++)
				image.bitmap.data[idx + i] = g * 255;
		} : (g, idx) => {
			for (let i = 0; i < 3; i++)
				image.bitmap.data[idx + i] = g * 255;
		};

		this.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
			renderPix(m.subset(mi(x, y)), idx);
			// alpha is always 1
			image.bitmap.data[idx + 3] = 255;
		});
		image.write(__dirname + '/' + path);
	}));
	console.log('\nwrote', path);
}

// import {question} from './interaction';
function mDiamondSquare(size, _steps, _scale = 1, _scaleMod = 1) {
	const m = math.zeros(size, size);
	// wSetSample(m, 0, 0, Math.random()); // first spot

	// const stepsThatDontFit = _steps.slice(0);
	// const [firstStepSize, firstStep] = stepsThatDontFit.shift();
	// const steps = [firstStep];
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
	let scaleMod = _scaleMod;
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
					// H = steps[i](H, halfStepScale, x, y);
					// G = steps[i](G, halfStepScale, x, y);
					H = steps[i].f(H, steps[i].scale * 0.5, avgH, x, y);
					G = steps[i].f(G, steps[i].scale * 0.5, avgG, x, y);
				}

				// console.log(H, G);

				wSetSample(m, x + halfStep, y, H);
				wSetSample(m, x, y + halfStep, G);
			}
		}
		// debug only!!
		// saveGrey(normalize(m), 'step' + stepSize + '.jpg');
		// question(stepSize);

		stepSize /= 2;
		// scale *= (scaleMod + 0.8);
		scaleMod *= 0.3;
		for (let i = 0; i < steps.length; i++)
			steps[i].scale *= scaleMod + 0.8;

		// if (stepsThatDontFit.length && stepsThatDontFit[0][0] === stepSize)
		// 	steps.push(stepsThatDontFit.shift()[1]);

		// return normalize(m);
	} while (stepSize > 1);
	return normalize(m);
}

function trunc(m, tval, cond = (v, t) => v < t) {
	const size = m.size()[0];
	const result = math.zeros(size, size);
	for (let y = 0; y < size; y++)
		for (let x = 0; x < size; x++) {
			const val = m.subset(mi(x, y));
			result.subset(mi(x, y), cond(val, tval) ? tval : val);
		}
	return result;
}

function selectCoords(m, comp) {
	const result = [];
	m.forEach((value, index) => {
		if (comp(value, index))
			result.push([value, index]);
	});
	return result;
}

function temperatureMap(heightMap, waterlevel, hVariance = 0.8, nStrength = 0.6, step = y => y) {
	const truncHM = normalize(trunc(heightMap, waterlevel));
	const size = heightMap.size()[0];
	const noise = mDiamondSquare(size, [
		[32, (p, c) => p + c * frand()],
		[16, (p, c) => p + c * frand() * 2],
		// [8, (p, c) => p + c * frand() * 0.4],
	]);
	// debug only!!
	save(noise, 'temp_noise.jpg');

	const m = math.zeros(size, size);
	const hs = size / 2;

	for (let y = 0; y < hs; y++) {
		const t = 1 - step(y / hs);
		for (let x = 0; x < size; x++) {
			// m.subset(mi([x, hs - y]), t);
			// console.log(x, y, t);
			const y1 = hs - y;
			m.subset(mi(x, y1),
				t *
				1 - (
					hVariance * truncHM.subset(mi(x, y1)) +
					nStrength * noise.subset(mi(x, y1))
				)
			);
			const y2 = hs + y;
			m.subset(mi(x, y2),
				t *
				1 - (
					hVariance * truncHM.subset(mi(x, y2)) +
					nStrength * noise.subset(mi(x, y2))
				)
			);
		}
	}
	return m;
}

console.log('init');
// const stop = profile();
const height = mDiamondSquare(128, [
	[32, (p, c) => p + c * frand()],
	[16, (p, c) => p + c * frand() * 0.3],
	[8, (p, c) => p + c * frand() * 0.1],
	// [16, (p, c) => p + c * frand() * 0.05],
]);
// stop2();
save(height, 'height.jpg', 1);
save(normalize(temperatureMap(height, waterLevel)), 'temperature.jpg');
