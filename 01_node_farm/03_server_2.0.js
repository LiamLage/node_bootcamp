/* Author: Liam Lage
	 Date:   07/03/2022

	 Description:
	 Node Bootcamp
	 Section 2

	 Simple Server 2.0
*/

const fs = require('fs');			// Docs - https://nodejs.org/dist/latest-v16.x/docs/api/fs.html
const http = require('http');	// Docs - https://nodejs.org/dist/latest-v16.x/docs/api/http.html
const url = require('url');		// Docs - https://nodejs.org/dist/latest-v16.x/docs/api/url.html
const slugify = require('slugify');	// Docs - https://www.npmjs.com/package/slugify

const replace_template = require('./modules/replace_template');

// Here we use the synchronous file read as we want it to execute before we create the server
// eslint-disable-next-line no-undef
const template_overview = fs.readFileSync(`${__dirname}/templates/template_overview.html`, 'utf-8');
// eslint-disable-next-line no-undef
const template_card = fs.readFileSync(`${__dirname}/templates/template_card.html`, 'utf-8');
// eslint-disable-next-line no-undef
const template_product = fs.readFileSync(`${__dirname}/templates/template_product.html`, 'utf-8');

// eslint-disable-next-line no-undef
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const data_obj = JSON.parse(data);	// Convert JSON into object

// map() creates a new array populated with the results of calling slugify on every element in the calling array.
const slugs = data_obj.map(element => slugify(element.product_name, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
	const { query, pathname } = (url.parse(req.url, true));

	// Handle routing
	// Overview page
	if(pathname === '/' || pathname === '/overview') {
		res.writeHead(200, {'Content-type': 'text/html'});	// Specify the response code & content type

		/* We iterate over the data_obj array & replace the place holders in the
			 template card with the current product (element)
		*/
		const cards_html = data_obj.map(element => replace_template(template_card, element)).join('');
		// console.log({cards_html});
		const output = template_overview.replace('{%PRODUCT_CARDS%}', cards_html);

		res.end(output);
	
	// Product page
	} else if(pathname === '/product') {
		res.writeHead(200, {'Content-type': 'text/html'});	// Specify the response code & content type
		const product = data_obj[query.id];
		const output = replace_template(template_product, product);

		res.end(output);

	// API
	} else if(pathname === '/api') {
		res.writeHead(200, {'Content-type': 'application/json'});	// Specify the response code & content type
		res.end(data);

	// Not found
	} else {
		// If the page doesn't exist, we respond with the response code & content type
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
