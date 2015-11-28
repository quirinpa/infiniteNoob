import Container from './Container';

// function randomInt (low, high) {
//     return Math.floor(Math.random() * (high - low) + low);
// }

export default class DeadBody extends Container {
	constructor(inventoryItemDescriptors) {
		super('dead body', 'a dead body lays, dead, in the ground.', inventoryItemDescriptors);
	}
}
