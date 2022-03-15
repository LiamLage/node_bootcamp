/* Author: Liam Lage
	 Date:   15/03/2022

	 Description:
	 Import Development Data
*/

const fs = require('fs');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { delete_all } = require('../../server');
// const tour_model = require(`${__dirname}/../../models/tour_model`);
const server = require(`${__dirname}/../../server`);

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const client = new MongoClient(DB);

const collection = client.db('natours').collection('tours');

// Connect to MongoDB
const db_connect = async () => {
  try {
    const con = await client.connect();
    console.log(`Connection status: ${con.topology.s.state}`);
  } catch (e) {
    console.error(`DB Connection Error: ${e}`);
  }
};

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours_simple.json`, 'utf-8')
);

// Import Data into Database
const import_data = async () => {
  try {
    const result = await server.create_many(tours);
  } catch (e) {
		console.error(e);
  }
	process.exit();
};

// Delete All Data from Collection
const delete_all_data = async () => {
  try {
    res = await server.delete_all();
    console.log(res);
  } catch (e) {
		console.error(e);
  }
	process.exit();
};

const run = async () => {
  // console.log(process.argv[2]);
  if (process.argv[2] == '--import') {
    await db_connect();
    import_data();
  } else if (process.argv[2] == '--delete') {
    await db_connect();
    delete_all_data();
  }
};

run();
