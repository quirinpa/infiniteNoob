import InteractiveObject from './InteractiveObject';
import {println, chalk} from './interaction';

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

export default class DeadBody extends InteractiveObject {
	constructor(props) {
		super(props || {
			name: 'dead body',
			description: 'a dead body lays, dead, in the ground.'
		});
		this.inventory = [['dead mouse'], ['10 silver coins']][randomInt(0, 2)];
		this.actions = [
			...this.actions, {
				alias: ['loot'],
				callback: character => {
					println(...this.inventory.map(item => chalk.blue(item) + ' added to inventory.'));
					character.inventory = character.inventory.concat(this.inventory);
					this.inventory = [];
				},
			}
		];
	}
}
