/* Author: Liam Lage
	 Date:   07/03/2022

	 Description:
	 Node Bootcamp
	 Section 2

	 Simple Web Server
*/

const http = require('http');
// const url = require('url');

const server = http.createServer((req, res) => {
	const path_name = req.url;

	if(path_name === '/overview') {
		res.end('Overview page');
	} else if(path_name === '/product') {
		res.end('Product page');
	} else if(path_name === '/') {
		res.end('Homepage');
	} else {
		// If the page doesn't exist, we send a header with the response code & content type
		res.writeHead(404, {
			'Content-type': 'text/html'
		});
		res.end(
			`<h1>404</h1>
			 <p1>Not Found</p1>
			 <a href="/">Return to home page</a>
			`
		);
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
});
