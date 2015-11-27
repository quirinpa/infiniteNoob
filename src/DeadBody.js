import InteractiveObject from './InteractiveObject';
import Inventory from './Inventory';

// function randomInt (low, high) {
//     return Math.floor(Math.random() * (high - low) + low);
// }

export default class DeadBody extends InteractiveObject {
	constructor(inventoryItems) {
		super('dead body', 'a dead body lays, dead, in the ground.');
		this.inventory = new Inventory(inventoryItems);
	}
}
