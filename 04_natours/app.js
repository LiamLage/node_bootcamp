/* Author:  Liam Lage
	 Date:    09/03/2022
	 Updated: 10/03/2022

	 Description:
	 Setting up Express & Basic Routing
*/

const express = require('express');
const morgan = require('morgan');

const tour_router = require(`${__dirname}/routes/tour_routes`);
const user_router = require(`${__dirname}/routes/user_routes`);

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware👋');
  next();
});

// Add the time to the request
app.use((req, res, next) => {
  req.request_time = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tour_router);
app.use('/api/v1/users', user_router);

module.exports = app;
