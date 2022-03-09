/* Author: Liam Lage
	 Date:   09/03/2022

	 Description:
	 Setting up Express & Basic Routing
*/

const fs = require('fs');
const express = require('express');

const app = express();

/* We will go into detail of middleware in lecture #58 - #60
   The data from the body is added to the request object
*/
app.use(express.json());

/* JSON will be converted to an array of JS objects, this will happen at application
   start before the event loop starts. It will be automatically reloaded when we write
	 a new tour to the file */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev_data/data/tours_simple.json`)
);

const get_all_tours = (req, res) => {
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
};

const get_tour = (req, res) => {
  // req.params gives us access to the parameters in the URL
  const id = req.params.id * 1; // convert the id string to a number

  /* find() method returns the value of the first element in the array who's id
		matches the req.id param, or undefined if its not found */
  const tour = tours.find((el) => el.id === id);

  // An over-simplified handling of an invalid request
  // if(id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

const create_tour = (req, res) => {
  // Generate a new tour ID - ID of last tour in list + 1
  const new_id = tours[tours.length - 1].id + 1;

  // Create a new object by merging the existing objects new_id & req.body
  const new_tour = Object.assign({ id: new_id }, req.body);

  tours.push(new_tour); // Add the new tour to the array of existing tours

  // Persist the new array to the tours_simple file
  fs.writeFile(
    `${__dirname}/dev_data/data/tours_simple.json`,
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

const update_tour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

const delete_tour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  // Response Code 204 - No content
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

// GET request handler - Read all tours
// app.get('/api/v1/tours', get_all_tours);

// GET request handler - Read specific tour
// app.get('/api/v1/tours/:id', get_tour);

// POST request handler - Create a new tour
// app.post('/api/v1/tours', create_tour);

// PATCH request handler - Update the properties that have changed
// app.patch('/api/v1/tours/:id', update_tour);

// DELETE request handler
// app.delete('/api/v1/tours/:id', delete_tour);

app
  /* We specify v1 so that we can make changes to the API
	   without breaking the production version */
  .route('/api/v1/tours')
  .get(get_all_tours)
  .post(create_tour);

app
  /* To create variables in the URL, we use a colon before the var, as in
		 :id above, we can add optional parameters like this :<parameter>? */
  .route('/api/v1/tours/:id')
  .get(get_tour)
  .patch(update_tour) // On a patch request, the client should only send the properties that have changed
  .delete(delete_tour);

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
