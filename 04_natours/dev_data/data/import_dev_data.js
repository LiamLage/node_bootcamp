/* Author: Liam Lage
	 Date:   15/03/2022

	 Description:
	 Import Development Data
*/

const fs = require('fs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
// const tour_controller = require(`${__dirname}/../../controllers/tour_controller`);
// const server = require(`${__dirname}/../../server`);

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

const validate_input = async (item) => {
  // Set default rating values
  if (item.ratings_average == null || !item.ratings_average)
    item.ratings_average = 4.5;
  if (item.ratings_quantity == null || !item.ratings_quantity)
    item.ratings_quantity = 0;

  // Set default date
  if (item.created_on == null || !item.created_on)
    item.created_on = new Date().toISOString();

  // Trim strings
  // item.summary = item.summary.trim();
  // item.description = item.description.trim();
  // console.log(item);
  collection.createIndex({ name: 1 }, { unique: true });
  return item;
};

// Import Data into Database
const import_data = async () => {
  try {
    const items = await validate_input(tours);
    const result = await collection.insertMany(items);
    console.log(`${result.insertedCount} document(s) were inserted`);
  } catch (e) {
    console.error(e);
  }
  process.exit();
};

// Delete All Data from Collection
const delete_all_data = async () => {
  try {
    const result = await collection.deleteMany();
    console.log(`${result.deletedCount} document(s) were deleted`);
    console.log(result);
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
