import GameObj from './GameObj';

export default class Item extends GameObj {
	constructor(name, description) {
		super(name, description, 'cyan');
		this.isItem = true;
	}
}
