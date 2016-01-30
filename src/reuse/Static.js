const Mapeable = require('./Mapeable');
module.exports = class Static extends Mapeable {
	constructor(name, description) {
		super(name, description, 'black');
	}
}
