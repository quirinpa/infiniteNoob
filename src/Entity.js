// import Stats from './Stats';
import Inventory from './Inventory';
import {chalk} from './interaction';
export default class Entity {
	constructor(name, area, lvl = 1) {
		this.area = area;
		this.name = name;
		this.lvl = lvl;
		this.inventory = new Inventory([], this);
	}
	print() {
		return chalk.blue(this.name);
	}
}
