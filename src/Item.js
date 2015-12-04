const GameObj = require('./GameObj');

module.exports = class Item extends GameObj {
	constructor(name, description) {
		super(name, description, 'cyan');
		this.isItem = true;
	}
}
