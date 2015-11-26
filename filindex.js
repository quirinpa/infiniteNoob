var input = require ("readline").createInterface({
	input: process.stdin,
	output:	process.stdout,
});

async function dialog(description, options) {
	let i = 0;

	const response = parseInt(await question(description + '\n' + options.map(option => {
		i = i + 1;
		return i + '| ' + option;
	}).join('\n') + '\n'));

	if (response <= 0 || response > options.length) {
		console.log('Your answer is invalid. Try again.');
		return await dialog(description, options);
	}

	return {
		id: response,
		name: options[response - 1]
	};
}

const question = text => new Promise(resolve => input.question(text + ' ', resolve));

 async function game() {
	const name = await question("what\'s your name?");
	console.log("nice to meet ya " + name);
	const idade = parseInt(await question ("How many year's you have in ya skin?"));
	if (idade < 18) console.log("please turn of you computer, you too young. Pease tell your parents about this :C.");
	else console.log('If youre elder then we can start this game right now! C: ');

	const kind = await dialog("What kind of Caracter are you?\nThere are only 3 kinds!", [
		"Police Man",
		'Thief',
		"Citizen"
	]);
	console.log(kind.name, 'id:', kind.id);
 }


game();
