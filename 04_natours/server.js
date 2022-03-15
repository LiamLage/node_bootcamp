/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Main entry point
*/

const { MongoClient } = require('mongodb');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require(`${__dirname}/app`);
const tour_model = require(`${__dirname}/models/tour_model`);

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

const validate_input = (item) => {
  // Set default rating values
  if (item.ratings_average == null || !item.ratings_average)
    item.ratings_average = 4.5;
  if (item.ratings_quantity == null || !item.ratings_quantity)
    item.ratings_quantity = 0;

  // Set default date
  if (item.created_on == null || !item.created_on)
    item.created_on = new Date().toISOString();

  // Trim strings
  item.summary = item.summary.trim();
  item.description = item.description.trim();
  // console.log(item);
  collection.createIndex({ name: 1 }, { unique: true });
  return item;
};

exports.create = async (input) => {
  item = validate_input(input);

  const result = await collection.insertOne({
    // validator: { $jsonSchema: tour_model.tour_schema },
    item,
  });
  // console.log(tour_model.tour_schema)
  console.log(`New tour created with ID: ${result.insertedId}`);
  return [result, item];
};

exports.create_many = async (input) => {
  input.forEach(validate_input);

  const result = await collection.insertMany(input, {
    $jsonSchema: tour_model.tour_schema,
  });
  console.log(`${result.insertedCount} tour(s) was/were inserted`);
  return [result, input];
};

const correct_filter = (input) => {
  // Convert the string object into int if they exist
	const dur = input?.duration;
	if (dur && !dur.$gte && !dur.$gt && !dur.$lte && !dur.$lt) {
		dur = parseInt(dur);
	}
  if (dur?.$gte) dur.$gte = parseInt(dur.$gte);
	if (dur?.$gt) dur.$gt = parseInt(dur.$gt);
	if (dur?.$lte) dur.$lte = parseInt(dur.$lte);
	if (dur?.$lt) dur.$lt = parseInt(dur.$lt);

	const max_grp = input?.max_group_size;
  if (input?.max_group_size && !input.max_group_size.$gte && !input.max_group_size.$gt && !input.max_group_size.$lte && !input.max_group_size.$lt) {
		input.max_group_size = parseInt(input.max_group_size);
	};
	if (max_grp?.$gte) max_grp.$gte = parseInt(max_grp.$gte);
	if (max_grp?.$gt) max_grp.$gt = parseInt(max_grp.$gt);
	if (max_grp?.$lte) max_grp.$lte = parseInt(max_grp.$lte);
	if (max_grp?.$lt) max_grp.$lt = parseInt(max_grp.$lt);

	const rate_avg = input?.ratings_average;
  if (rate_avg && !rate_avg.$gte && !rate_avg.$gt && !rate_avg.$lte && !rate_avg.$lt) {
		rate_avg = parseInt(rate_avg);
	};
	if (rate_avg?.$gte) rate_avg.$gte = parseInt(rate_avg.$gte);
	if (rate_avg?.$gt) rate_avg.$gt = parseInt(rate_avg.$gt);
	if (rate_avg?.$lte) rate_avg.$lte = parseInt(rate_avg.$lte);
	if (rate_avg?.$lt) rate_avg.$lt = parseInt(rate_avg.$lt);

	const rate_qnt = input?.ratings_quantity;
  if (rate_qnt && !rate_qnt.$gte && !rate_qnt.$gt && !rate_qnt.$lte && !rate_qnt.$lt) {
		rate_qnt = parseInt(rate_qnt);
	};
	if (rate_qnt?.$gte) rate_qnt.$gte = parseInt(rate_qnt.$gte);
	if (rate_qnt?.$gt) rate_qnt.$gt = parseInt(rate_qnt.$gt);
	if (rate_qnt?.$lte) rate_qnt.$lte = parseInt(rate_qnt.$lte);
	if (rate_qnt?.$lt) rate_qnt.$lt = parseInt(rate_qnt.$lt);

	const price = input.price;
  if (price && !price.$gte && !price.$gt && !price.$lte && !price.$lt) {
		price = parseInt(price);
	};
	if (price.$gte) price.$gte = parseInt(price.$gte);
	if (price.$gt) price.$gt = parseInt(price.$gt);
	if (price.$lte) price.$lte = parseInt(price.$lte);
	if (price.$lt) price.$lt = parseInt(price.$lt);

  return input;
};

exports.get_all_tours = async (
  { max_results = Number.MAX_SAFE_INTEGER },
  filter
) => {
  const res = JSON.parse(filter);
  console.log(res);

	// const test = res.duration.$gte
	// console.log(`$gte: ${res.duration.$gte}`)

  const corrected_filter = correct_filter(res);
  console.log(corrected_filter);

  // Find the tours that match the filter, or all of them if there is no filter
  const cursor = collection.find(corrected_filter).limit(max_results);

  const results = await cursor.toArray();

  if (results.length > 0) {
    return results;
  } else {
    return 'No tours found';
  }
};

exports.get_tour_by_id = async (tour_id) => {
  // console.log(tour_id)
  // I couldn't get this to work with _id, using name instead
  const result = await collection.findOne({ name: tour_id });

  if (result) {
    console.log(`Found tour with the name ${tour_id}`);
    return result;
  } else {
    throw `Could not find tour with the name ${tour_id}`;
  }
};

exports.update_tour_by_id = async (tour_id, updated_tour) => {
  // I couldn't get this to work with _id, using name instead
  const result = await collection.findOneAndUpdate(
    { name: tour_id },
    { $set: updated_tour }
  );
  console.log(`Updated tour with the name ${tour_id}`);
  return result;
};

exports.delete_tour_by_id = async (tour_id) => {
  // I couldn't get this to work with _id, using name instead
  const result = await collection.deleteOne({ name: tour_id });
  // console.log(`Deleting tour with name/id: ${tour_id}`);

  if (result) {
    console.log(`Deleted ${result.deletedCount} tour with name: ${tour_id}`);
    return result;
  } else {
    throw `Could not delete tour with ID: ${tour_id}`;
  }
};

exports.delete_all = async () => {
  const result = await collection.deleteMany();
  console.log(`${result.deletedCount} document(s) were deleted`);
  return result;
};
