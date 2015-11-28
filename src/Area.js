import {system} from './interaction';
import GameObj from './GameObj';
import Inventory from './Inventory';

export default class Area extends GameObj {
	constructor(name = 'The Void', description = 'You are lost, nothing for you to do here, nowhere to go.', itemList = [], interactiveObjects = []) {
		super(description);
		this.name = name;
		this.ios = interactiveObjects;
		this.inventory = new Inventory(itemList, this, 'There are various objects laying around:');
	}
	view() {
		super.view();
		this.ios.forEach(io => io.view());
		system(this.inventory.print(true));
	}
	enter() {
		this.view();
		return this;
	}
	dropInto(itemStack) {
		this.inventory.addItemStack(itemStack);
	}
}
