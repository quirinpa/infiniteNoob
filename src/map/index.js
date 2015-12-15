"use strict";
const N = 128;
const wl = 0.5;

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
});
canvas.height = canvas.width = N;
canvasHolder.appendChild(canvas);

canvasHolder.appendChild(document.createElement('br'));

const ctx = canvas.getContext('2d');

const frand = require('./frand');
const diamondSquare = require('./diamondSquare');
const temperatureMap = require('./temperatureMap');
const normalize = require('./normalize');
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

const h = normalize(diamondSquare(N, [
	[64, (p, c) => p + c * frand()],
	[32, (p, c) => p + c * frand() * 0.5],
	[16, (p, c) => p + c * frand() * 0.01],
	[8, (p, c) => p + c * frand() * 0.001],
]));

const t = temperatureMap(N, h, wl); // also pressure?

const m = (() => {
	const mr = normalize(diamondSquare(N, [
		[64, (p, c) => p + c * frand()],
		[32, (p, c) => p + c * frand() * 0.5],
		[16, (p, c) => p + c * frand() * 0.25],
		[8, (p, c) => p + c * frand() * 0.125],
	]));

	const iwl = 1 - wl;
	return normalize(mr.map((v, i) => {
		const rh = h[i];
		return wl > rh ? 1 : (1 - (rh - wl) / iwl) * (0.8 + mr[i] * 0.2);
	}));
})();

const b = h.map((v, i) => v > wl ? getBiome(t[i], m[i]) : 'rgba(120, 120, 255, 1)');

for (let y = 0; y < N; y++) {
	const yN = y * N;
	for (let x = 0; x < N; x++) {
		ctx.fillStyle = b[x + yN];
		ctx.fillRect(x, y, 1, 1);
	}
}

module.exports = {N, h, t, m, b};
