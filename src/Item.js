import {println} from './interaction';

export default class Item {
	constructor(name, description, quantity) {
		this.name = name;
		this.description = description;
		this.quantity = quantity || 1;
	}
	view() {
		println(this.description);
	}
}
