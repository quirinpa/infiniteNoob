const io = require('./io');
const Mapeable = require('./Mapeable');

module.exports = class ItemStack extends Mapeable {
	constructor(item, quantity = 1) {
		super(item.name, item.description, item.color);
		this.item = item;
		this.quantity = quantity;
	}
	print() {
		return (this.quantity > 1 ? io.color('yellow', this.quantity) + ' ' : '') +
			this.item.print() +
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
