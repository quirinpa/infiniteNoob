const randomMap4 = () => (new Array(4)).map(() => Math.random());
// const MapSize = 20;
function tesselate(map4, times) {
	let oldMap = map4;
	let newMap = oldMap;
	let t = 0;
	while (t < times) {
		const newDim = (times*2)^2;
		newMap = new Array(newDim);

		t = t + 1;
	}
}

export default tesselate(randomMap4(), 3);
