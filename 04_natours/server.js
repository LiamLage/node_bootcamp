/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Main entry point
*/

const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require(`${__dirname}/app`);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const client = new MongoClient(DB);

const collection = client.db('natours').collection('tours');

exports.get_db = () => {
  return collection;
};

// Start Server
const start_server = async (port) => {
  try {
    await app.listen(port);
    console.log(`App running on port ${port}`);
  } catch (e) {
    console.error(`Server Error: ${e}`);
  }
};

// Connect to MongoDB
const db_connect = async () => {
  try {
    const con = await client.connect();
    console.log(`Connection status: ${con.topology.s.state}`);

    // To use input validation, drop the natours db & uncomment below.
    // client.db().createCollection('tours', {
    //   validator: { $jsonSchema: tour_model.tour_schema },
    // });
  } catch (e) {
    console.error(`DB Connection Error: ${e}`);
  }
};

const run = async () => {
  await start_server(process.env.PORT);
  await db_connect();
};

run();
