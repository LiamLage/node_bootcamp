/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Main entry point
*/

const dotenv = require('dotenv');
const app = require(`${__dirname}/app`);
const { MongoClient } = require('mongodb');

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const client = new MongoClient(DB);

const collection = client.db('natours').collection('tours');

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
  } catch (e) {
    console.error(`DB Connection Error: ${e}`);
  }
};

const run = async () => {
  await start_server(process.env.PORT);
  await db_connect();

  // const tour_object = new Tour({
  //   name: 'The Forest Hiker',
  //   rating: 4.7,
  //   price: 979,
  // });

  // create_tour(validate(tour_object));
};

run();

exports.create = async (input) => {
  // input.rating = parseFloat(parseFloat(input.rating).toFixed(1));
  // input.price = parseFloat(parseFloat(input.price).toFixed(2));
  if (
    typeof input.name != 'string' ||
    input.name === '' ||
    input.name === null
  ) {
    throw 'Invalid name.';
  } else if (input.duration === null || isNaN(input.duration)) {
    throw 'Invalid duration';
  } else if (input.max_group_size === null || isNaN(input.max_group_size)) {
    throw 'Invalid Group Size';
  } else if (
    typeof input.difficulty != 'string' ||
    input.difficulty === '' ||
    input.difficulty === null
  ) {
    throw 'Invalid Difficulty';
  } else if (input.ratings_average > 5) {
    throw 'Invalid Rating Average';
  } else if (isNaN(input.rating_quantity) || input.rating_quantity === null) {
    if(input.rating_quantity === null) rating_quantity = 0;
		throw 'Invalid Rating Quantity';
  } else if (input.price === null || isNaN(input.price)) {
    throw 'Invalid price';
  } else {
    console.log(input);
    collection.createIndexes([
      {
        key: { name: 1, unique: true },
      },
      {
        key: { duration: 1 },
      },
      {
        key: { max_group_size: 1 },
      },
      {
        key: { difficulty: 1 },
      },
      {
        key: { ratings_average: 1 },
      },
      {
        key: { price: 1 },
      },
    ]);

    const result = await collection.insertOne({
      name: input.name,
      rating: input.rating,
      price: input.price,
    });
    console.log(`New tour created with ID: ${result.insertedId}`);
    return result;
  }
};

exports.get_all_tours = async ({ max_results = Number.MAX_SAFE_INTEGER }) => {
  const cursor = collection.find().limit(max_results);

  const results = await cursor.toArray();

  if (results.length > 0) {
    return results;
  } else {
    return 'No tours found';
  }
};

exports.get_tour_by_id = async (tour_id) => {
  // console.log(tour_id)
  const result = await collection.findOne({ name: tour_id });

  if (result) {
    console.log(`Found tour with the name ${tour_id}`);
    return result;
  } else {
    throw `Could not find tour with the name ${tour_id}`;
  }
};

exports.update_tour_by_id = async (tour_id, updated_tour) => {
  const result = await collection.findOneAndUpdate(
    { name: tour_id },
    { $set: updated_tour }
  );
  console.log(`Updated tour with the name ${tour_id}`);
  return result;
};

exports.delete_tour_by_id = async (tour_id) => {
  const result = await collection.deleteOne({ name: tour_id });
  // console.log(`Deleting tour with name/id: ${tour_id}`);

  if (result) {
    console.log(`Deleted ${result.deletedCount} tours with name: ${tour_id}`);
    return result;
  } else {
    throw `Could not delete tour with ID: ${tour_id}`;
  }
};
