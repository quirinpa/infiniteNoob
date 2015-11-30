const waterLevel = 150;

function frand() {
	return Math.random() * 2 - 1;
}

// http://www.bluh.org/code-the-diamond-square-algorithm/
import math from 'mathjs';

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

class GMatrix {
	constructor(size) {
		this.size = size;
		this.matrix = math.zeros(size, size);
	}
	sample(x, y) {
		return this.matrix.subset(math.index(...wrapCoords(x, y, this.size)));
	}
	set(x, y, value) {
		this.matrix.subset(math.index(...wrapCoords(x, y, this.size)), value);
	}
	diamondSquare(_stepSize, _scale, _scaleMod) {
		let stepSize = _stepSize;
		let scaleMod = _scaleMod;
		let scale = _scale;
		do {
			const halfStep = stepSize / 2;
			for (let y = 0; y < this.size; y += stepSize) {
				for (let x = 0; x < this.size; x += stepSize) {
					const a = this.sample(x, y);
					const b = this.sample(x + stepSize, y);
					const c = this.sample(x, y + stepSize);
					const d = this.sample(x + stepSize, y + stepSize);

					const e = (a + b + c + d) / 4.0 + frand() * stepSize * scale;
					this.set(x + halfStep, y + halfStep, e);
				}
			}
			for (let y = 0; y < this.size; y += stepSize) {
				for (let x = 0; x < this.size; x += stepSize) {
					const a = this.sample(x, y);
					const b = this.sample(x + stepSize, y);
					const c = this.sample(x, y + stepSize);
					const d = this.sample(x + halfStep, y + halfStep);
					const e = this.sample(x + halfStep, y - halfStep);
					const f = this.sample(x - halfStep, y + halfStep);

					const H = (a + b + d + e) / 4.0 + frand() * stepSize * scale * 0.5;
					const g = (a + c + d + f) / 4.0 + frand() * stepSize * scale * 0.5;
					this.set(x + halfStep, y, H);
					this.set(x, y + halfStep, g);
				}
			}
			stepSize /= 2;
			scale *= (scaleMod + 0.8);
			scaleMod *= 0.3;
		} while (stepSize > 1);
	}
	normalize() {
		let min = 1;
		let max = 0;
		this.matrix.forEach(value => {
			if (value < min) min = value;
			if (value > max) max = value;
		});
		// console.log('normalization', min, max);
		this.matrix = math.divide(math.add(this.matrix, -min), max - min);
	}
}

import Jimp from 'jimp';

function saveGrey(gMatrix, path) {
	// console.log('saving');
	(new Jimp(gMatrix.size, gMatrix.size, function(err, image) {
		this.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
			const greyVal = gMatrix.matrix.subset(math.index(x, y)) * 255;

			// process.stdout.write(`(${x},${y},${greyVal})`);
			for (let i = 0; i < 2; i++)
				image.bitmap.data[idx + i] = greyVal;
			if (greyVal < waterLevel)
				image.bitmap.data[idx + 2] = 255;
			else
				image.bitmap.data[idx + 2] = greyVal;
			image.bitmap.data[idx + 3] = 255;
		});
		image.write(__dirname + '/' + path);
	}));
	console.log('\nwrote', path);
}

const mat = new GMatrix(128);
mat.diamondSquare(8, 2, 0.1);
mat.normalize();
saveGrey(mat, 'mat.jpg');

const mat2 = new GMatrix(128);
mat2.diamondSquare(32, 2, 0.1);
mat2.normalize();
saveGrey(mat2, 'mat2.jpg');

mat.matrix = math.add(mat.matrix, mat2.matrix);
mat.normalize();
saveGrey(mat, 'final.jpg');
