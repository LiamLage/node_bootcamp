/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 The Problem with Callbacks: Callback Hell
*/

const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  if (err) return console.error(`Error reading file: ${err}`);
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.error(`Error: ${err.message}`);
      console.log(res.body.message);

      fs.writeFile('dog_img.txt', res.body.message, (err) => {
        if (err) return console.error(`Write Error: ${err}`);
        console.log('Random dog image url saved to file');
      });
    });
});
