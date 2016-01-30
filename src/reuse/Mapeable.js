const GameObj = require('./GameObj');

function camelCase(str) {
	return str.toLowerCase()
		// Replaces any - or _ characters with a space
		.replace( /[-_]+/g, ' ')
		// Removes any non alphanumeric characters
		.replace( /[^\w\s]/g, '')
		// Uppercases the first character in each group immediately following a space
		// (delimited by spaces)
		.replace( / (.)/g, $1 => $1.toUpperCase())
		// Removes spaces
			.replace( / /g, '' );
}

module.exports = class Mapeable extends GameObj {
	constructor(name, description, color) {
		super(name, description, color);
		this.camelCasedName = camelCase(name);
	}
}
