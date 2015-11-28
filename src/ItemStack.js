import {chalk} from './interaction';
import {printItem} from './Item';

export default class ItemStack {
	constructor(item, quantity = 1) {
		this.camelCasedName = item.camelCasedName;
		this.item = item;
		this.quantity = quantity;
	}
	print() {
		return (this.quantity > 1 ? chalk.yellow(this.quantity) + ' ' : '') +
			printItem(this.item.camelCasedName) +
			(this.quantity > 1 ? 's' : '');
	}
	view() {
		this.item.view();
		return true;
	}
	take(quantity) {
		if (this.quantity < quantity) return false;
		this.quantity -= quantity;
		return true;
	}
	put(quantity) {
		this.quantity += quantity;
		return true;
	}
	takeOut(quantity) {
		return !this.take(quantity) ? false : new ItemStack(this.item, quantity);
	}
}
