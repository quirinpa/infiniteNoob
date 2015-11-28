import readLineSync from 'readline-sync';
import clk from 'chalk';
export const chalk = clk;
export const question = text => readLineSync.question(chalk.gray(text + ' '));
/* eslint-disable no-console */
export const println = (...args) => {
	console.log(...args);
	return false;
};

export function dialog(description, options) {
	let i = 0;

	const response = parseInt(readLineSync.question(description + '\n' + options.map(option => {
		i = i + 1;
		return i + '| ' + option;
	}).join('\n') + '\n'), 10);

	if (response <= 0 || response > options.length) {
		println(chalk.yellow('Your answer is invalid. Try again.'));
		return dialog(description, options);
	}

	return {
		id: response,
		name: options[response - 1],
	};
}

export const system = string => println(chalk.dim(string));
export const warning = string => system(chalk.yellow(string));

export function camelCase(str) {
	return str.toLowerCase()
		// Replaces any - or _ characters with a space
		.replace( /[-_]+/g, ' ')
		// Removes any non alphanumeric characters
		.replace( /[^\w\s]/g, '')
		// Uppercases the first character in each group immediately following a space
		// (delimited by spaces)
		.replace( / (.)/g, $1 => $1.toUpperCase())
		// Removes spaces
			.replace( / /g, '' );
}
