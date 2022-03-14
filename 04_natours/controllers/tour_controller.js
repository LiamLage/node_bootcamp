/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Tour Controller
*/

const server = require(`${__dirname}/../server`);

exports.get_all_tours = async (req, res) => {
  try {
    const tours = await server.get_all_tours(Number.MAX_SAFE_INTEGER);
    // We will send back all the data for the tours resource
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
