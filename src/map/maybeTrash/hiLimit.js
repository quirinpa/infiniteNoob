module.exports = function hiLimit(N, m, ceil) {
	m.map(val => val > ceil ? ceil : val);
};
