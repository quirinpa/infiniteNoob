const input = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = text => new Promise(resolve => input.question(text + ' ', resolve));


const shadystreet = {
	name: 'a shady street',
	description: 'You are in a street filled with prostitutes and murdering cockroaches.',
	items: ['big black dildo', 'seringe', 'murdering cockroach'];
}

function goInto(place) {
	const {name, description, items} = place;
	console.log(`You step into ${name}.\n${description}`)
}

async function game() {
	const name = await question('What\'s your name?');
	console.log('nice to meet ya ' + name);
	const idade = parseInt(await question('How old, ho?'));
	if (idade > 18) console.log('get in, quick, and drop your smelly panties.');
	else console.log('go drink milk, you have to grooooooooooow.');
};

game();
