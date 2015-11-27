import {println, chalk} from './interaction';

export default class Inventory {
	constructor(startingItems = []) {
		this.items = {};
		startingItems.forEach(item => this.items[item.name] = item);
	}
	transferTo(otherInventory) {
		Object.keys(this.items).forEach(key => {
			const thisItemStack = this.items[key];
			const otherItemStack = otherInventory.items[key];
			if (otherItemStack) otherItemStack.quantity += thisItemStack.quantity;
			else otherInventory.items[key] = thisItemStack;
			delete this.items[key];
		});
	}
	loot(character) {
		const keys = Object.keys(this.items);

		if (!keys) return println(chalk.dim('the inventory is empty.'));

		keys.forEach(key => {
			const item = this.items[key];
			println(chalk.yellow(item.quantity) + ' ' + chalk.blue(item.name) + ' added to inventory.');
		});

		this.transferTo(character.inventory);
	}
}
