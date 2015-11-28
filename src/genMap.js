import math from 'mathjs';

const noiseRatio = 0.3;
const mapSize = 9; // must be odd

let map = (new Array(mapSize * mapSize)).fill(0);

function setPos(x, y, val) {
	map[y * mapSize + x] = val;
}

function noise(iter) {
	const noiseFactor = noiseRatio / iter;
	return -(noiseFactor / 2) + noiseFactor * Math.random();
}

function gVal(val) {
	return Math.floor(val * 10);
}

function print() {
	let j = 0;
	process.stdout.write(map.map(val => {
		const ret = gVal(val);
		if (++j === mapSize) {
			j = 0;
			return ret + '\n';
		}
		return ret;
	}).join('') + '\n');
}

function setCorners(x, y, size, values) {
	const x2 = x + size - 1;
	const y2 = y + size - 1;
	[[x, y], [x2, y], [x, y2], [x2, y2]]
		.forEach((val, id) => setPos(val[0], val[1], values[id]));
}

function randomCorners(x, y, dim) {
	return setCorners(x, y, dim, [
		Math.random(),
		Math.random(),
		Math.random(),
		Math.random(),
	]);
}

class Square {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.x2 = x + size - 1;
		this.y2 = y + size - 1;
		this.size = size;
	}
	setAverages(iter) {
		const coordinates = [
			[this.x, this.y],
			[this.x2, this.y],
			[this.x, this.y2],
			[this.x2, this.y2],
		].map(([x1, y1]) => x1 + y1 * this.size);
		const values = coordinates.map(p => map[p]);
		// console.log(values);

		const mpX = Math.floor(this.x + this.size / 2);
		const mpY = Math.floor(this.y + this.size / 2);

		const midPoint = values.reduce((res, val) => res + val, 0) / 4;
		// console.log('mp', midPoint, 'x', mpX, 'y', mpY);
		setPos(mpX, mpY, midPoint + noise(iter));

		const averages = [
			(values[0] + values[1] + midPoint) / 3,
			(values[0] + values[2] + midPoint) / 3,
			(values[1] + values[3] + midPoint) / 3,
			(values[2] + values[3] + midPoint) / 3,
		];
		// setPos(mpX, this.y, averages[0] + noise(iter));
		// setPos(this.x, mpY, averages[1] + noise(iter));
		// setPos(this.x + this.size - 1, mpY, averages[2] + noise(iter));
		// setPos(mpX, this.y + this.size - 1, averages[3] + noise(iter));
		setPos(mpX, this.y, averages[0]);
		setPos(this.x, mpY, averages[1]);
		setPos(this.x + this.size - 1, mpY, averages[2]);
		setPos(mpX, this.y + this.size - 1, averages[3]);
	}
}
function tesselate(rect, iter) {
	// console.log('tess lvl', iter);
	rect.setAverages(iter);
	if (iter <= 1) return;
	const nextSideLen = (rect.size + 1) / 2;
	const nRectangles = Math.ceil(rect.size / nextSideLen);
	// console.log('nRectanglesSQRT', nRectangles);
	for (let rx = 0; rx < nRectangles; rx++)
		for (let ry = 0; ry < nRectangles; ry++)
			tesselate(new Square(
				rect.x + rx * (nextSideLen - 1),
				rect.y + ry * (nextSideLen - 1),
				nextSideLen
			), iter - 1);
}

randomCorners(0, 0, mapSize);
// setAverages(0, 0, mapSize, centerP, averages);
const nIterations = Math.floor(Math.sqrt(mapSize));
tesselate(new Square(0, 0, mapSize), nIterations);
print();
// console.log('created map of size', mapSize, 'in', nIterations, 'iterations');
let min = 0;
let max = 1;
map.forEach(pixel => {
	if (pixel < min) min = pixel;
	else if (pixel > max) max = pixel;
});
const mmdiff = max - min;
map = map.map(pixel => pixel * mmdiff + min);
console.log('normalized:');
print();
