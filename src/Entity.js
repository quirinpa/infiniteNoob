// import Stats from './Stats';
import Mapeable from './Mapeable';
import Inventory from './Inventory';
export default class Entity extends Mapeable {
	constructor(name, area, lvl = 1) {
		super(name, 'Entity ' + name, 'blue');
		this.area = area;
		this.lvl = lvl;
		this.inventory = new Inventory([], this);
	}
}
