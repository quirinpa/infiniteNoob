import Mapeable from './Mapeable';
export default class InteractiveObject extends Mapeable {
	constructor(name, description) {
		super(name, description, 'black');
	}
}
