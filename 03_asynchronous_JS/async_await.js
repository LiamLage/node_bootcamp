/* Author: Liam Lage
	 Date:   09/03/2022

	 Description:
	 Consuming promises with async await
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

// An implementation with a try catch for each await method
const get_dog_image = async () => {
  try {
		// Read the dog breed from dog file
    const data = await read_file_promise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    try {
			// Get the image URL for the specified breed
      const res = await superagent.get(
        `https://dog.ceo/api/breed/${data}/images/random`
      );
      console.log(res.body.message);

      try {
				// Write the image URL to dog_img
        await write_file_promise(`${__dirname}/dog_img.txt`, res.body.message);
        console.log('Random dog image url saved to file');
      } catch (err) {
        console.error('Could not save dog url');
        console.error(err);
      }
    } catch (err) {
      console.error(`API error: ${err.message}`);
    }
  } catch (err) {
    console.error('Could not read file');
    console.error(err);
  }
};

// One try catch with all the await methods in the block
// const get_dog_image = async () => {
//   try {
//     const data = await read_file_promise(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);

//     await write_file_promise(`${__dirname}/dog_img.txt`, res.body.message);
//     console.log('Random dog image url saved to file');
//   } catch (err) {
//     console.error(err);
//   }
// };

get_dog_image();
