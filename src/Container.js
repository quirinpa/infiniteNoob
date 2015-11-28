import InteractiveObject from './InteractiveObject';
import Inventory from './Inventory';

export default class Container extends InteractiveObject {
	constructor(name, description, inventoryItemDescriptors) {
		super(name, description);
		this.inventory = new Inventory(inventoryItemDescriptors, this);
	}
}
