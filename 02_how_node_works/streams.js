/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 Streams in Practice
*/

const fs = require('fs');
const server = require('http').createServer();

const solution_1 = () => {
  server.on('request', (req, res) => {
    /* Solution 1 
	     The problem with this solution is that we will have to load the entire file into
	  	 memory before we can serve it
	  */
	  console.log('Solution 1');

    fs.readFile('test_file.txt', (err, data) => {
      if(err) console.log({ err });
      res.end(data);
    });
	});
};

const solution_2 = () => {
  server.on('request', (req, res) => {
	  /* Solution 2
	     Streams
	  	 We read the file piece by piece, as soon as a piece is
	  	 available, we send it to the client.
	  	 The problem with this method is that we can read the
	  	 file from disk far faster than we can write it to the
	  	 response, this is known as backpressure
	  */
	  console.log('Solution 2');

	  const readable = fs.createReadStream('test_file.txt');

	  readable.on('data', piece => {
	  	res.write(piece);
	  });

	  // Handle the end of file
	  readable.on('end', () => {
	  	res.end();
	  });

	  // Handle File not Found
	  readable.on('error', err => {
	  	console.error({err});
	  	res.statusCode = 500;	// File not found
	  	res.end('File not found');
	  });
	});
};

const solution_3 = () => {
  server.on('request', (req, res) => {
		/* Solution 3 
			We will pipe the output of our readable stream to the input
			of a readable stream
		*/
		console.log('Solution 3');

		const readable = fs.createReadStream('test_file.txt');
		readable.pipe(res); // readable_source.pipe(writable_destination)
	});
};

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening...');
})

// solution_1();
// solution_2();
solution_3();
