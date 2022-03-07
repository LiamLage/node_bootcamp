/* Author: Liam Lage
   Date:   07/03/2022
 
   Description:
   Node Bootcamp
   Section: 2

	 Reading & writing files, synchronous & asynchronous
*/

const fs = require('fs');

// Blocking, synchronous method
const text_in = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text_in);
const text_out = `This is what we know about the avocado:\n${text_in}.\n\nCreated on: ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', text_out);
console.log('File written.');

/* Non-blocking, asynchronous method
   Once the file has been read, it will trigger the callback function
*/
fs.readFile('./txt/start.txt', 'utf-8', (error, data_1) => {
	if(error) {
		console.error({error});
		return;
	}
	else {
		fs.readFile(`./txt/${data_1}.txt`, 'utf-8', (error, data_2) => {
			console.log(data_2);
			fs.readFile('./txt/append.txt', 'utf-8', (error, data_3) => {
				console.log(data_3);

				fs.writeFile('./txt/final.txt', `${data_2}\n${data_3}`, 'utf-8', error => {
					console.log('Your file has been written.');
				});
			});
		});
	}
});

console.log('Will read file.');
