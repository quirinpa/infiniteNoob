const io = require('./io');

module.exports = class GameObj {
	constructor(name, description, color = 'white') {
		this.name = name;
		this.description = description;
		this.color = color;
		this.coloredName = io.color(this.color, this.name);
	}
	view() {
		io.log(this.description.replace(this.name, this.coloredName));
	}
	print() {
		return this.coloredName;
	}
}
