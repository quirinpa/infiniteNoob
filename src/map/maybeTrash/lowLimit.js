module.exports = function lowLimit(N, m, floor) {
	m.map(val => val < floor ? floor : val);
};
