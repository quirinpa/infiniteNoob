const io = require('./io');
const GameObj = require('./GameObj');
const Inventory = require('./Inventory');

module.exports = class Area extends GameObj {
	constructor(name = 'The Void', description = 'You are lost in The Void, nothing for you to do here, nowhere to go.', itemList = [], statics = []) {
		super(name, description);
		this.statics = statics;
		this.inventory = new Inventory(itemList, this, 'There are various objects laying around:');
	}
	view() {
		super.view();
		this.statics.forEach(obj => obj.view());
		io.log(this.inventory.print(true));
	}
	enter() {
		this.view();
		return this;
	}
	dropInto(itemStack) {
		this.inventory.addItemStack(itemStack);
	}
}
