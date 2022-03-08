/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 Section 2
	 Event Loop in Practice

	 Simulate some aspects of the event loop
*/

/* Event Loop Queues
	 Expired Timer callbacks
	 I/O Polling callbacks
	 setImmediate callbacks
	 Close callbacks
	 PROCESS.NEXTTICK() - Will be executed on completion of the current phase
	 Other Microtasks (Resolved promises) - Will be executed on completion of the current phase
*/

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();	// To time our encryption operations

// To change the size of the thread pool
/* personal note - this did not seem to change how long the encryption
   took to execute as it did in the lecture */
process.env.UV_THREADPOOL_SIZE = 1;

// This code is outside of the event loop & will be executed first
setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished')); // Will be executed on completion of the current phase

// This code is inside the event loop because it is inside a callback function
fs.readFile(`${__dirname}/test_file.txt`, () => {
  console.log('I/O finished');
  console.log('______________________________________________________________');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished')); // Will be executed on completion of the current phase

  process.nextTick(() => console.log('Process.nextTick')); // Will be executed on completion of the current phase

	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start, 'Password encrypted');
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start, 'Password encrypted');
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start, 'Password encrypted');
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start, 'Password encrypted');
	});
});

// This line is outside of the event loop & will be executed first
console.log('Top Level Code Complete');
