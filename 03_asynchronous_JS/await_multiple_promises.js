/* Author: Liam Lage
	 Date:   09/03/2022

	 Description:
	 Waiting for Multiple Promises Simultaneously
*/

const fs = require('fs');
const superagent = require('superagent');

// Building the read_file promise
const read_file_promise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
			// If readFile encountered error, reject the promise
      if (err) reject(`Read File ${err}`);
			// If readFile was successful, ressolve the promise
			resolve(data);
    });
  });
};

// Building the write_file promise
const write_file_promise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
			// If writeFile encountered error, reject the promise
      if (err) reject(`Write File Error: ${err}`);
			// If writeFile was successful, ressolve the promise
      resolve('success');
    });
  });
};

const get_dog_image = async () => {
  try {
		// Get the dog breed from the text file
    const data = await read_file_promise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

		// Get the first random image url for the specified breed 
    const res_1_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

		// Get the second random image url for the specified breed 
		const res_2_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
		
		// Get the third random image url for the specified breed 
		const res_3_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    /* If we want to run multiple promises concurrently,
		   we use Promise.all(<array of promises>), it creates
			 a promise that is resolved with an array of results
			 when all the provided promises resolve, or rejected
			 when any promise is rejected  */
		const all = await Promise.all([res_1_promise, res_2_promise, res_3_promise]);

		// create a new array that only contains the .body.message for each promise result
		const images = all.map(element => element.body.message);
		console.log(images);

		// Write each of the URLs to dog_img, separated by a new line
    await write_file_promise(`${__dirname}/dog_img.txt`, images.join('\n'));
    console.log('Random dog image url saved to file');
  } catch (err) {
    console.error(err);
		throw(err);	/* We must throw an error, otherwise the promise will still be resolved &
		               the .then() below will still be invoked. */
  }
	return('2: Dog image is ready');
};

/* Immediately Invoked Function Expression 
   That gets the returned promise, but makes
	 use of async/await instead of .then() &
	 .catch()
*/
(async () => {
	try {
		console.log('1: Will get dog image!');
		const result = await get_dog_image();
		console.log(result);
		console.log('3: Done getting dog pics');
	} catch (err) {
		console.error('ERROR');
	}
})();

