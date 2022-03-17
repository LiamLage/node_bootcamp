/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Tour Controller
*/

const server = require(`${__dirname}/../server`);
const API_features = require(`${__dirname}/../utils/api_features`);

exports.alias_top_tours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings_average,price';
  req.query.fields = 'name,price,ratings_average,summary,difficulty';
  next();
};

const validate_input = async (item) => {
  const collection = server.get_db();
  // Set default rating values
  if (item.ratings_average === null || !item.ratings_average)
    item.ratings_average = 4.5;
  if (item.ratings_quantity === null || !item.ratings_quantity)
    item.ratings_quantity = 0;

  // Set default date
  if (item.created_on === null || !item.created_on)
    item.created_on = new Date().toISOString();

  // Trim strings
  item.summary = item.summary.trim();
  item.description = item.description.trim();
  console.log(item);
  collection.createIndex({ name: 1 }, { unique: true });
  return item;
};

exports.create_tour = async (req, res) => {
  try {
    const collection = server.get_db();
    const item = await validate_input(req.body);

    const result = await collection.insertOne({
      // validator: { $jsonSchema: tour_model.tour_schema },
      item,
    });
    // console.log(tour_model.tour_schema)
    console.log(`New tour created with ID: ${result.insertedId}`);

    // Response code 201 - Created
    res.status(201).json({
      status: 'success',
      data: {
        tour: result,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.get_all_tours = async (req, res) => {
  try {
    // Execute query
    const features = new API_features(server.get_db(), req.query)
      .filter()
      .sort()
      .limit_fields()
      .paginate();

    const tours = await features.query;
    // Send response
    res.status(200).json({
      status: 'success',
      results:
        tours.length /* Not part of the JSend standard, but it is usefull to have when
												we are sending an array with multiple objects */,
      data: {
        tour: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.get_tour = async (req, res) => {
  try {
    const collection = server.get_db();

    // Get tour by name, should be by _id but I can't get it to work
    let tour = await collection.findOne({ name: req.params.id });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.update_tour = async (req, res) => {
  try {
    const collection = server.get_db();

    // Update tour by name, should be by _id but I can't get it to work
    const result = await collection.findOneAndUpdate(
      { name: req.params.id },
      { $set: req.body }
    );
    console.log(`Updated tour with ID: ${req.params.id}`);

    res.status(200).json({
      status: 'success',
      data: {
        tour: result,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.delete_tour = async (req, res) => {
  try {
    const collection = server.get_db();

    // Delete tour by name, should be by _id but I can't get it to work
    const result = await collection.deleteOne({ name: req.params.id });
    // Response Code 204 - No content
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.get_tour_stats = async (req, res) => {
  try {
    const collection = server.get_db();

    const stats = await collection
      .aggregate([
        {
          $match: { ratings_average: { $gte: 4.5 } }, // Match only tours with an average rating higher than 4.5
        },
        {
          $group: {
            // _id: '$ratings_average',
            _id: { $toUpper: '$difficulty' },
            num_tours: { $sum: 1 },
            num_ratings: { $sum: '$ratings_quantity' },
            avg_rating: { $avg: '$ratings_average' },
            avg_price: { $avg: '$price' },
            min_price: { $min: '$price' },
            max_price: { $max: '$price' },
          },
        },
        {
          $sort: { avg_price: -1 }, // Sort by decending average price
        },
        // {
        //   $match: {
        //     _id: { $ne: 'EASY' }, // All documents that are not easy
        //   },
        // },
      ])
      .toArray();

    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.get_monthly_plan = async (req, res) => {
  try {
    const collection = server.get_db();
    const year = req.params.year * 1;

    const start_date = `${year}-01-01T10:00:00.000Z`;
    const end_date = `${year}-12-31T10:00:00.000Z`;

    const plan = await collection
      .aggregate([
        {
          $unwind: '$start_dates',
        },
        {
          $match: {
            start_dates: { $gte: start_date, $lte: end_date },
          },
        },
        {
          $group: {
            _id: { $month: { $toDate: '$start_dates' } },
            num_tour_starts: { $sum: 1 },
            tour: { $push: '$name' },
          },
        },
        {
          $addFields: { month: '$_id' },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $sort: { num_tour_starts: -1 },
        },
      ])
      .toArray();

    res.status(200).json({
      status: 'success',
      data: {
        tour: plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
