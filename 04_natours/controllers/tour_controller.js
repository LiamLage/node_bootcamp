/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Tour Controller
*/

const fs = require('fs');

/* JSON will be converted to an array of JS objects, this will happen at application
   start before the event loop starts. It will be automatically reloaded when we write
	 a new tour to the file */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev_data/data/tours_simple.json`)
);

/* Use check_id middleware function to check for valid ID
   instead of checking in each function that requires ID. */
exports.check_id = (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.check_body = (req, res, next) => {
	if(!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: 'failed',
			message: 'Must contain name & price parameters',
		});
	}
	next();
};

exports.get_all_tours = (req, res) => {
  // We will send back all the data for the tours resource
  console.log(req.request_time);
  res.status(200).json({
    status: 'success',
    requested_at: req.request_time,
    results:
      tours.length /* Not part of the JSend standard, but it is usefull to have when
											we are sending an array with multiple objects */,
    data: {
      tour: tours,
    },
  });
};

exports.get_tour = (req, res) => {
  // req.params gives us access to the parameters in the URL
  console.log(req.params);
  const id = req.params.id * 1; // convert the id string to a number

  /* find() method returns the value of the first element in the array who's id
			matches the req.id param, or undefined if its not found */
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

exports.create_tour = (req, res) => {
  // Generate a new tour ID - ID of last tour in list + 1
  const new_id = tours[tours.length - 1].id + 1;

  // Create a new object by merging the existing objects new_id & req.body
  const new_tour = Object.assign({ id: new_id }, req.body);

  tours.push(new_tour); // Add the new tour to the array of existing tours

  // Persist the new array to the tours_simple file
  fs.writeFile(
    `${__dirname}/../dev_data/data/tours_simple.json`,
    JSON.stringify(tours),
    (err) => {
      // Response code 201 - Created
      res.status(201).json({
        status: 'success',
        data: {
          tour: new_tour,
        },
      });
    }
  );
};

exports.update_tour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

exports.delete_tour = (req, res) => {
  // Response Code 204 - No content
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
