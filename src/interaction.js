export const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

export const question = text => new Promise(resolve => readline.question(chalk.magenta(text) + ' ', resolve));

import clk from 'chalk';
export const chalk = clk;
export const println = (...args) => console.log(...args);

export async function dialog(description, options) {
	let i = 0;

	const response = parseInt(await question(description + '\n' + options.map(option => {
		i = i + 1;
		return i + '| ' + option;
	}).join('\n') + '\n'));

	if (response <= 0 || response > options.length) {
		println(chalk.yellow('Your answer is invalid. Try again.'));
		return await dialog(description, options);
	}

	return {
		id: response,
		name: options[response - 1]
	};
};
