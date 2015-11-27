import {println, chalk} from './interaction';
export default class InteractiveObject {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}
	view(){
		println(chalk.dim(this.description));
	}
}
