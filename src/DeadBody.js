import Container from './Container';

export default class DeadBody extends Container {
	constructor(inventoryItemDescriptors) {
		super('dead body', 'a dead body lays, dead, in the ground.', inventoryItemDescriptors);
	}
}
