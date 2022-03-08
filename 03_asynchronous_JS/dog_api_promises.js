/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 From Callbacks to Promises
	 Learning to Build Promises
*/

const fs = require('fs');
const superagent = require('superagent');

// Building the read_file promise
const read_file_promise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(`Read File ${err}`);
      resolve(data);
    });
  });
};

// Building the write_file promise
const write_file_promise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(`Write File Error: ${err}`);
      resolve('success');
    });
  });
};

read_file_promise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    return write_file_promise(`${__dirname}/dog_img.txt`, res.body.message);
  })
  .then(() => {
    console.log('Random dog image url saved to file');
  })
  .catch((err) => {
    console.error(err);
  });
