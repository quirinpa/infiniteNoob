const Item = require('./Item');

module.exports = class DeadMouse extends Item {
	constructor() {
		super('dead mouse', 'A dead mouse. It probably died of rabies.');
	}
}
