const waterLevel = 0.9;

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

function diamondSquare(size, _stepSize, _scale, _scaleMod) {
	const m = math.zeros(size, size);
	let stepSize = _stepSize;
	let scaleMod = _scaleMod;
	let scale = _scale;
	do {
		const halfStep = stepSize / 2;
		for (let y = 0; y < size; y += stepSize) {
			for (let x = 0; x < size; x += stepSize) {
				const a = wSample(m, x, y);
				const b = wSample(m, x + stepSize, y);
				const c = wSample(m, x, y + stepSize);
				const d = wSample(m, x + stepSize, y + stepSize);

				const e = (a + b + c + d) / 4.0 + frand() * stepSize * scale;
				wSetSample(m, x + halfStep, y + halfStep, e);
			}
		}
		for (let y = 0; y < size; y += stepSize) {
			for (let x = 0; x < size; x += stepSize) {
				const a = wSample(m, x, y);
				const b = wSample(m, x + stepSize, y);
				const c = wSample(m, x, y + stepSize);
				const d = wSample(m, x + halfStep, y + halfStep);
				const e = wSample(m, x + halfStep, y - halfStep);
				const f = wSample(m, x - halfStep, y + halfStep);

				const H = (a + b + d + e) / 4.0 + frand() * stepSize * scale * 0.5;
				const g = (a + c + d + f) / 4.0 + frand() * stepSize * scale * 0.5;
				wSetSample(m, x + halfStep, y, H);
				wSetSample(m, x, y + halfStep, g);
			}
		}
		stepSize /= 2;
		scale *= (scaleMod + 0.8);
		scaleMod *= 0.3;
	} while (stepSize > 1);
	return m;
}

function normalize(m) {
	const firstVal = wSample(m, 0, 0);
	let min = firstVal;
	let max = firstVal;
	m.forEach(value => {
		if (value < min) min = value;
		if (value > max) max = value;
	});
	// console.log('normalization', min, max);
	return math.divide(math.add(m, -min), max - min);
}

function mDiamondSquare(size, _steps, _scale = 1, _scaleMod = 1) {
	const m = math.zeros(size, size);

	const stepsThatDontFit = _steps.slice(0);
	const stepsThatFit = [];

	let stepSize = _steps[0][0];
	let scaleMod = _scaleMod;
	let scale = _scale;

	do {
		if (stepsThatDontFit.length && stepsThatDontFit[0][0] === stepSize)
			stepsThatFit.push(stepsThatDontFit.shift()[1]);

		const halfStep = stepSize / 2;

		for (let y = 0; y < size; y += stepSize) {
			for (let x = 0; x < size; x += stepSize) {
				const a = wSample(m, x, y);
				const b = wSample(m, x + stepSize, y);
				const c = wSample(m, x, y + stepSize);
				const d = wSample(m, x + stepSize, y + stepSize);
				const avg = (a + b + c + d) / 4.0;

				let e = 0;
				for (let i = 0; i < stepsThatFit.length; i++)
					e = e + frand() * stepsThatFit[i] * stepSize * scale;

				wSetSample(m, x + halfStep, y + halfStep, avg + e);
			}
		}

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

				let H = 0;
				let G = 0;
				for (let i = 0; i < stepsThatFit.length; i++) {
					H = H + frand() * stepsThatFit[i] * stepSize * scale * 0.5;
					G = G + frand() * stepsThatFit[i] * stepSize * scale * 0.5;
				}

				wSetSample(m, x + halfStep, y, avgH + H);
				wSetSample(m, x, y + halfStep, avgG + G);
			}
		}
		stepSize /= 2;
		scale *= (scaleMod + 0.8);
		scaleMod *= 0.3;
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

function temperatureMap(heightMap, waterlevel, hVariance = 0.8, nStrength = 0.3, step = y => y) {
	const truncHM = normalize(trunc(heightMap, waterlevel));
	const size = heightMap.size()[0];
	const noise = normalize(diamondSquare(size, 16, 1, 0.1));

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
				(1 - hVariance * truncHM.subset(mi(x, y1))) *
				(1 - nStrength * noise.subset(mi(x, y1)))
			);
			const y2 = hs + y;
			m.subset(mi(x, y2),
				t *
				(1 - hVariance * truncHM.subset(mi(x, y2))) *
				(1 - nStrength * noise.subset(mi(x, y2)))
			);
		}
	}
	return m;
}
// class GMatrix {
// 	constructor(size) {
// 		this.size = size;
// 		this.matrix = math.zeros(size, size);
// 		this.temperatures = math.zeros(size, size);
// 	}
// }

import Jimp from 'jimp';

function saveGrey(m, path) {
	const size = m.size();
	const waterLevel255 = waterLevel * 255;
	(new Jimp(size[0], size[1], function(err, image) {
		this.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
			const greyVal = m.subset(mi(x, y)) * 255;

			// process.stdout.write(`(${x},${y},${greyVal})`);
			for (let i = 0; i < 3; i++)
				image.bitmap.data[idx + i] = greyVal;
			// for (let i = 0; i < 2; i++)
			// 	image.bitmap.data[idx + i] = greyVal;
			// if (greyVal < waterLevel255 )
			// 	image.bitmap.data[idx + 2] = 255;
			// else
			// 	image.bitmap.data[idx + 2] = greyVal;
			image.bitmap.data[idx + 3] = 255;
		});
		image.write(__dirname + '/' + path);
	}));
	console.log('\nwrote', path);
}

const stop1 = profile();
const height = math.add(
	normalize(diamondSquare(128, 32, 1, 0.1)),
	math.multiply(normalize(diamondSquare(128, 8, 1, 0.1)), 0.7)
);
stop1();

saveGrey(normalize(height), 'height.jpg');
saveGrey(normalize(temperatureMap(height, waterLevel)), 'temperature.jpg');

const stop2 = profile();
const height2 = mDiamondSquare(128, [[64, 0.5], [32, 1], [8, 2]]);
stop2();

saveGrey(height2, 'height2.jpg');

// function selectRandom(arr, n) {
// 	if (arr.length < n)
// 		throw new Error('can\'t select ' + n +
// 			' random members of a size ' + arr.length + ' array');
// 	const aux = arr.slice(0);
// 	let result = [];
// 	for (let i = 0; i < n && aux.length; i++) {
// 		const r = Math.round(Math.random() * (aux.length - 1));
// 		result = result.concat(aux.splice(r - 1, 1));
// 	}
// 	return result;
// }
//
// const nRivers = 20;
// const landCoords = selectCoords(adder, value => value > waterLevel);
// // console.log(landCoords);
// const riverSources = selectRandom(landCoords, nRivers);
// console.log(riverSources, waterLevel);
