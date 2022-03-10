/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Main entry point
*/

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require(`${__dirname}/app`);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});