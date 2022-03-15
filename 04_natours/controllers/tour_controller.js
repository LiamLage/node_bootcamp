/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Tour Controller
*/

const server = require(`${__dirname}/../server`);

exports.get_all_tours = async (req, res) => {
  try {
    // console.log(req.query);
    // Build query
    // 1) Filtering
    const query_obj = { ...req.query };
    const excluded_fields = ['page', 'sort', 'limit', 'fields']; // For now we will ignore these until they are implemented later
    excluded_fields.forEach((el) => delete query_obj[el]);

    // 2) Advanced Filtering
		let query_str = JSON.stringify(query_obj);
		query_str = query_str.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
		// console.log(JSON.parse(query_str))



    const query = server.get_all_tours(Number.MAX_SAFE_INTEGER, query_str);

    // Execute query
    const tours = await query;
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
    const tour = await server.get_tour_by_id(req.params.id);
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

exports.create_tour = async (req, res) => {
  try {
    const result = await server.create(req.body);
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

exports.update_tour = async (req, res) => {
  try {
    const tour = await server.update_tour_by_id(req.params.id, req.body);

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

exports.delete_tour = async (req, res) => {
  try {
    await server.delete_tour_by_id(req.params.id);
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
