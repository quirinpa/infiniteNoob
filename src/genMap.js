import math from 'mathjs';

const noiseRatio = 10; // other values show what might be a bug
const mapSize = 32; // must be power of 2

const pointMapSize = mapSize + 1;

const mapMat = math.zeros(pointMapSize, pointMapSize);

function noise(iter) {
	const noiseFactor = noiseRatio / iter;
	return -(noiseFactor / 2) + noiseFactor * Math.random();
}

function setCorners(x, y, size, values) {
	const x2 = x + size;
	const y2 = y + size;
	[[x, y], [x2, y], [x, y2], [x2, y2]].forEach((val, id) =>
			mapMat.subset(math.index(val[0], val[1]), values[id]));
}

function randomCorners(x, y, dim) {
	return setCorners(x, y, dim, [
		Math.random(),
		Math.random(),
		Math.random(),
		Math.random(),
	]);
}

// import fs from 'fs';
import Jimp from 'jimp';

function saveHeightMatrix(matrix, path) {
	// console.log('saving');
	(new Jimp(mapSize, mapSize, function(err, image) {
		this.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
			const greyVal = Math.round(((
				matrix.subset(math.index(x, y)) +
				matrix.subset(math.index(x + 1, y)) +
				matrix.subset(math.index(x, y + 1)) +
				matrix.subset(math.index(x + 1, y + 1))
			) / 4) * 255);
			process.stdout.write(`(${x},${y},${greyVal})`);
			for (let i = 0; i < 3; i++)
				image.bitmap.data[idx + i] = greyVal;
			image.bitmap.data[idx + 3] = 255;
		});
		image.write(__dirname + '/' + path);
	}));
	console.log('\nwrote', path);
}
function format(n) {
	return Math.round(n * 9);
}
function printSquared(matrix) {
	for (let y = 0; y < mapSize; y++) {
		for (let x = 0; x < mapSize; x++) {
			const greyVal = format((
				matrix.subset(math.index(x, y)) +
				matrix.subset(math.index(x + 1, y)) +
				matrix.subset(math.index(x, y + 1)) +
				matrix.subset(math.index(x + 1, y + 1))
			) / 4);
			process.stdout.write(`${greyVal}`);
		}
		process.stdout.write('\n');
	}
}

// function print(matrix) {
// 	for (let y = 0; y < pointMapSize; y++) {
// 		for (let x = 0; x < pointMapSize; x++)
// 			process.stdout.write(`${format(matrix.subset(math.index(x, y)))}`);
// 		process.stdout.write('\n');
// 	}
// }

// let gSteps = 0;
class Square {
	constructor(x, y, sSize) {
		this.x = x;
		this.y = y;
		this.x2 = x + sSize;
		this.y2 = y + sSize;
		this.sSize = sSize;
		this.rSize = sSize + 1;
	}

	setAverages(iter) {
		const values = [
			[this.x, this.y],
			[this.x2, this.y],
			[this.x, this.y2],
			[this.x2, this.y2],
		].map(([x, y]) => mapMat.subset(math.index(x, y)));

		const mpX = this.x + this.sSize / 2;
		const mpY = this.y + this.sSize / 2;
		// console.log('mpmp', mpX, mpY);

		const midPoint = values.reduce((res, val) => res + val, 0) / 4 + noise(iter);
		mapMat.subset(math.index(mpX, mpY), midPoint);
		// console.log('avr', midPoint, mpX, mpY);

		const averages = [
			(values[0] + values[1] + midPoint) / 3,
			(values[0] + values[2] + midPoint) / 3,
			(values[1] + values[3] + midPoint) / 3,
			(values[2] + values[3] + midPoint) / 3,
		];

		// console.log('averages', midPoint, averages);

		mapMat.subset(math.index(mpX, this.y), averages[0]);
		mapMat.subset(math.index(this.x, mpY), averages[1]);
		mapMat.subset(math.index(this.x2, mpY), averages[2]);
		mapMat.subset(math.index(mpX, this.y2), averages[3]);
		// print(mapMat);
		// console.log('.....');
	}
}

function tesselate(rect, iter = 1) {
	// console.log('tesselate', rect, 'lvl', iter);

	rect.setAverages(iter);

	if (rect.sSize === 2) return; // finished

	const newSSize = rect.sSize / 2;
	const nRectangles = rect.sSize / newSSize;
	// console.log('dividing in', nRectangles * nRectangles, newSSize + 'x' + newSSize, 'squares');

	for (let rx = 0; rx < nRectangles; rx++)
		for (let ry = 0; ry < nRectangles; ry++)
			tesselate(new Square(
				rect.x + rx * newSSize,
				rect.y + ry * newSSize,
				newSSize
			), iter + 1);

	// if (iter === 1) print(mapMat);
}

randomCorners(0, 0, mapSize);

tesselate(new Square(0, 0, mapSize));
// console.log('tess complete');
function normalize(matrix) {
	let min = 1;
	let max = 0;
	matrix.forEach(value => {
		if (value < min) min = value;
		if (value > max) max = value;
	});
	// console.log('normalization', min, max);
	return math.divide(math.add(matrix, -min), max - min);
}


printSquared(normalize(mapMat));
saveHeightMatrix(normalize(mapMat), 'nnoise' + noiseRatio + '.jpg');
