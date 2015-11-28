import InteractiveObject from './InteractiveObject';
import Inventory from './Inventory';

// function randomInt (low, high) {
//     return Math.floor(Math.random() * (high - low) + low);
// }

export default class Container extends InteractiveObject {
	constructor(name, description, inventoryItemDescriptors) {
		super(name, description);
		this.inventory = new Inventory(inventoryItemDescriptors, this);
	}
}
