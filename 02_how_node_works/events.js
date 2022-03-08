/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 Events in Practice
*/

const event_emmitter = require('events');
const http = require('http');

class Sales extends event_emmitter {
	constructor() {
		super();
	}
}

const my_emmitter = new Sales();

// Set up event observers/listeners
my_emmitter.on('new_sale', () => {
  console.log('There was a new sale');
});

my_emmitter.on('new_sale', () => {
  console.log('Customer name: Jonas');
});

my_emmitter.on('new_sale', stock => {
	console.log(`There are now ${stock} items left in stock.`);
});

my_emmitter.emit('new_sale', 9); // Emit a new_sale event

// ----------------------------------------------------------------------------------

const server = http.createServer();

server.on('request', (req, res) => {
	console.log('Request received');
	console.log(req.url);
	res.end('Request received');
});

server.on('request', (req, res) => {
	console.log('Another request');
});

server.on('close', () => {
	console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Waiting for requests...');
});