import {system} from './interaction';

export default class GameObj {
	constructor(description) {
		this.description = description;
	}
	view() {
		system(this.description);
	}
}
