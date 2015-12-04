const Static = require('./Static');
const Inventory = require('./Inventory');

module.exports = class Container extends Static {
	constructor(name, description, inventoryItemDescriptors) {
		super(name, description);
		this.inventory = new Inventory(inventoryItemDescriptors, this);
	}
}
