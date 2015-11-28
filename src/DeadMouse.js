import Item from './Item';
export default class DeadMouse extends Item {
	constructor(quantity) {
		super('dead mouse', 'A dead mouse. It probably died of rabies.', quantity);
	}
}