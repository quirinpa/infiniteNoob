import {system, warning} from 'io';
import Entity from './Entity';
import {printItemStack} from './ItemStack';

export default class Character extends Entity {
	constructor(name, area, lvl) {
		super(name, area, lvl);
		this.pose = 'standing';
	}
	sit() {
		if (this.pose === 'standing') {
			system(this.print() + ' sat down.');
			this.pose = 'sitting';
			return true;
		}
		warning('You are already sitting down.');
		return false;
	}
	stand() {
		if (this.pose === 'sitting') {
			system(this.print() + ' stood up.');
			this.pose = 'standing';
			return true;
		}
		warning('You are already standing up.');
		return false;
	}
	loot(container) {
		const itemList = container.inventory.print();
		if (!itemList) return false;
		system(itemList + ' added to your inventory.');
		container.inventory.transferTo(this.inventory);
		return true;
	}
	drop(camelCasedItemName, quantity) {
		const itemStack = this.inventory.takeOut(camelCasedItemName, quantity);
		if (!itemStack) return system('You don\'t have ' + printItemStack(camelCasedItemName, quantity) + '.');
		this.area.inventory.addItemStack(itemStack);
		system('You drop ' + itemStack.print());
		return true;
	}
}
