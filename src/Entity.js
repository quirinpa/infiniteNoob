// import Stats from './Stats';
const Mapeable = require('./Mapeable');
const Inventory = require('./Inventory');

module.exports = class Entity extends Mapeable {
	constructor(name, area, lvl = 1) {
		super(name, 'Entity ' + name, 'blue');
		this.area = area;
		this.lvl = lvl;
		this.inventory = new Inventory([], this);
	}
}
