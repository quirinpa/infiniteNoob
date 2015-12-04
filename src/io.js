"use strict";

const setStyle = (element, style) =>
	Object.keys(style)
		.forEach(key => element.style[key] = style[key]);

const gamebox = document.getElementById('gamebox');
setStyle(gamebox, {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
});

const log = document.createElement('div');
setStyle(log, {
	padding: '7px',
	flex: '1 1 auto',
	overflow: 'auto',
});

const input = document.createElement('input');
setStyle(input, {
	padding: '7px',
	border: 'none',
	outline: 'none',
	backgroundColor: 'rgba(100, 100, 100, 0.4)',
	outlineTop: 'solid 1px grey',
	flex: 'none',
});

gamebox.appendChild(log);
gamebox.appendChild(input);

function println(text) {
	log.innerHTML += text + '<br>';
	log.scrollTop = log.scrollHeight;
}

const color = (c, text) => `<font color="${c}">${text}</font>`;

function system(text) {
	println('<span style="opacity: 0.7;">' + text + '</span>');
}

function warn(text) {
	println(color('orange', text));
}

let questionCallback;
function question(label, callback) {
	system(label);
	questionCallback = callback;
}

let processCommandCallback = () => {};
input.onkeypress = e => {
	if (e.keyCode === 13 && input.value.trim()) {
		if (questionCallback) {
			questionCallback(input.value);
			questionCallback = false;
		} else
			processCommandCallback(input.value);

		input.value = '';
	}
};

function processCommands(gamef) {
	processCommandCallback = gamef;
}

module.exports = {
	println, color,
	log: system,
	warn,
	question,
	processCommands,
	setStyle,
	elements: {gamebox, log},
};
