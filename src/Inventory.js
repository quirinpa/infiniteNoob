import {system} from './interaction';
import ItemStack from './ItemStack';
// import Item from './Item';
// import {Map} from 'immutable';

export default class Inventory {
	constructor(itemDescriptors = [], owner, descriptor) {
		this.owner = owner;
		this.descriptor = descriptor || this.owner.print() + '\'s inventory: ';
		this.itemStacks = new Map();

		if (Array.isArray(itemDescriptors)) {
			itemDescriptors.forEach(itemDescriptor => Array.isArray(itemDescriptor) ?
				this.addItemStack(new ItemStack(itemDescriptor[0], itemDescriptor[1])) :
				this.addItemStack(new ItemStack(itemDescriptor, 1)));
		// it's an Inventory
		} else itemDescriptors.transferTo(this);
	}
	addItemStack(itemStack) {
		const eItemStack = this.itemStacks.get(itemStack.camelCasedName);
		if (eItemStack) eItemStack.put(itemStack.quantity);
		else this.itemStacks.set(itemStack.camelCasedName, itemStack);
		return true;
	}
	transferTo(otherInventory) {
		this.itemStacks.forEach(itemStack => {
			otherInventory.addItemStack(itemStack);
		});
		this.itemStacks.clear();
		return true;
	}
	takeOut(camelCasedItemName, quantity) {
		const itemStack = this.itemStacks.get(camelCasedItemName);
		if (!itemStack) return false;

		const newItemStack = itemStack.takeOut(quantity);
		if (!itemStack.quantity) this.itemStacks.delete(camelCasedItemName);
		return newItemStack;
	}
	print() {
		if (!this.itemStacks.size) return '';
		return Array.from(this.itemStacks)
			.map(([, itemStack]) => itemStack.print())
			.join(', ');
	}
	view() {
		if (!this.itemStacks.size) return system(this.descriptor + ' has no items.');
		system(this.descriptor + ' ' + this.print());
		return true;
	}
}
