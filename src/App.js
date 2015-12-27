import React from 'react';

class App extends React.Component {
	render() {
		return (<div>hello world</div>);
	}
}
// babel-plugin-react-transform does not support pure functions
// module.exports = () => (<div>hello world</div>);
module.exports = App;
