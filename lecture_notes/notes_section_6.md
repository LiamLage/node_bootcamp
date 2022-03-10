# Section 6 - Express: Let's Start Building the Natours API

---

## [Lecture 47](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064540)

### **Section Intro**

---

## [Lecture 48](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064840)

### **What is Express?**

- Express is a minimal Node.js framework, a higher level of abstraction
- Express contains a robust set of features:
  - Complex routing
  - Easier handling of requests & responses
  - Middleware
  - Server-side rendering
  - etc
- Express allows for rapid development of Node.js applications - we don't have to reinvent the wheel
- Express makes it easier to organize our application into the MVC architecture

---

## [Lecture 49](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064842)

### **Installing Postman**

[Postman](https://www.postman.com/)

[Postman Docs](https://learning.postman.com/docs/getting-started/introduction/)

Postman simplifies API development.

---

## [Lecture 50](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064844)

### **Setting up Express & Basic Routing**

[Express Documentation](https://expressjs.com/en/4x/api.html)

```JavaScript
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' }); // Sending json response
});

app.post('/', (req, res) => {
  res.send.status(200)('You can post to this endpoint...');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
```

---

## [Lecture 51](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064846)

### **APIs & RESTful API Design**

### [**A**pplication **P**rogramming **I**nterface](https://www.ibm.com/cloud/learn/api)

On a high level, an **API** simplifies software development by enabling
applications to exchange data and functionality easily & securely.

### [**RE**presentational **S**tate **T**ransfer](https://restfulapi.net/)

**REST** is an architectural style for distributed hypermedia systems. Roy Fielding first presented it in 2000 in his famous [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

[REST Architectural Constraints](https://restfulapi.net/rest-architectural-constraints/)

1. Separate API into logical resources
    - **Resource**: Object or representation of something, which
    has data associated to it. Any information that can be named
    can be a resource.
2. Expose structured, resource-based URLs
    - URL: <https://www.natours.com/addNewTour>
      - `/addNewTour` is an endpoint
      - `/getTour`
      - `/updateTour`
      - `/deleteTour`
      - etc
3. Use HTTP methods
   - Endpoints should contain only resources, and use HTTP methods for actions,
     let's rewrite the above endpoints to follow this convention:
      - The base endpoint will become `/tours`
      - `POST` - Create a Resource
        - /addNewTour --> `POST`/tours
      - `GET` - Read a Resource
        - /getTour --> `GET`/tours (returns all tours in the DB)
        - If we want a specific tour we would include the ID: `GET`/tours/tour_id
      - `PUT` & `PATCH` - Update a Resource
        - /updateTour --> `PUT`/tours/tour_id (the client should send the entire updated object)
        - /updateTour --> `PATCH`/tours/tour_id (the client should send only the part of the object that has changed)
      - `DELETE` - Delete a Resource
        - /deleteTour --> `DELETE`/tours/tour_id
   - The client can perform the four basic **CRUD** operations:
      - **C**reate
      - **R**ead
      - **U**pdate
      - **D**elete
   - There may be operations that are not CRUD, in that case we will make endpoints for them, for example `/login` or `/search`
   - Endpoints may contain multiple resources, for example:
     - /getToursByUser --> `GET`/users/user_id/tours
     - /deleteToursByUser --> `DELETE` /users/user_id/tours/tour_id
4. Send data as JSON (usually)

    <https://www.natours.com/tours/5>

    ```JSON
    /* A common response formatting: JSend
       Others include: JSOPN:API & OData JSON Protocol
    */
    {
      "status": "success",
      "data": {
        "id": 5,
        "tour_name": "The Park",
        "rating": "4.9",
        "guides": {
          {
            "name": "Steven Miller",
            "role": "Lead Guide"
          },
          {
            "name": "Lisa Brown",
            "role": "Tour Guide"
          }
        }
      }
    }
    ```

5. Be stateless
    - All state is handled on the client side. This means that each request must contain all the
      information necessary to process a certain request. The server should not have to remember
      previous requests, the client application must entirely keep the session state.
      - Examples of state: `logged_in`, `current_page`, etc

---

## [Lecture 52](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064848)

### **Starting our API: Handling GET Requests**

```JavaScript
app.get('/api/v1/tours', (req, res) => { /* We specify v1 so that we can make changes to the API
                                            without breaking the production version */
  // We will send back all the data for the tours resource
  res.status(200).json({
    status: 'success',
    results: tours.length, /* Not part of the JSend standard, but it is usefull to have when
                              we are sending an array with multiple objects */
    data: {
      tours: tours,
    }
  });
});
```

---

## [Lecture 53](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064850)

### **Handling POST Requests**

```JavaScript
app.post('/api/v1/tours', (req, res) => {
  // Generate the tour ID
  const new_id = tours[tours.length - 1].id + 1
  const new_tour = Object.assign({id: new_id}, req.body); // Creates a new object from the existing objects new_id & req.body  
  tours.push(new_tour); // Add the new tour to the array of existing tours
  
  // Persist the new array to the tours_simple file
  fs.writeFile(`${__dirname}/dev_data/data/tours_simple.json`, JSON.stringify(tours), err =>{
    // Response code 201 - Created
    res.status(201).json({
      "status": "success",
      "data": {
        tour: new_tour
      }
    });
  });
});
```

---

## [Lecture 54](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064852)

### **Responding to URL Parameters**

To create parameters in the URL, we use a colon before the paramater, as in
`/api/v1/tours/:id`. We can add optional parameters by adding a question mark
after the parameter as in `/api/v1/tours/:x?`.

`req.params` gives us access to the parameters in the URL.

To convert the ID string into an integer we multiply by one:
`const id = req.params.id *  1;`.

```JavaScript
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1; // convert the id string to a number

  /* find() method returns the value of the first element in the array who's id
    matches the req.id param, or undefined if its not found */
  const tour = tours.find(el => el.id === id);

  // An over-simplified handling of an invalid request
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  };

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
});
```

---

## [Lecture 55](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064856)

### **Handling PATCH Requests**

In a patch request, the client should send only the properties of the object that have changed.

```JavaScript
app.patch('/api/v1/tours/:id', (req, res) => {
  if(req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>'
    },
  });
});
```

---

## [Lecture 56](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064860)

### **Handling DELETE Requests**

In a patch request, the client should send only the properties of the object that have changed.

```JavaScript
app.delete('/api/v1/tours/:id', (req, res) => {
  if(req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }

  // Response Code 204 - No content
  res.status(204).json({
    status: 'success',
    data: {
      tour: null
    },
  });
});
```

---

## [Lecture 57](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064864)

### **Refactoring Our Routes**

We separated our handler functions from the routes.

For example, the GET request for all tours:

```JavaScript
const get_all_tours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length
    data: {
      tour: tours,
    },
  });
};
```

And the routing:

```JavaScript
app
  .route('/api/v1/tours')
  .get(get_all_tours)
  .post(create_tour);

app
  .route('/api/v1/tours/:id')
  .get(get_tour)
  .patch(update_tour)
  .delete(delete_tour);
```

---

## [Lecture 58](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064866)

### **Middleware & the Request-Response Cycle**

![req-res_cycle](C:/Users/Kurt/Documents/education/node_course/middleware_request_response_cycle.JPG)

---

## [Lecture 59](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064868)

### **Creating Our Own Middleware**

Below we have a middleware that adds the current time to the request

```JavaScript
// Add the time to the request
app.use((req, res, next) => {
  req.request_time = new Date().toISOString();
  next();
});
```

---

## [Lecture 60](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064872)

### **Using 3rd-Party Middleware**

[Express Morgan](https://github.com/expressjs/morgan)

```JavaScript
const morgan = require('morgan');

app.use(morgan('dev'));
```

---

## [Lecture 61](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064878)

### **Implementing the 'Users' Routes**

```JavaScript
// Example of getting all users
const get_all_users = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Example of getting specific user
const get_user_by_id = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

app.route('/api/v1/users')
   .get(get_all_users)
   .post(create_user);

app
  .route('/api/v1/users/:id')
  .get(get_user_by_id)
  .patch(update_user)
  .delete(delete_user);
```

---

## [Lecture 62](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064882)

### **Creating & Mounting Multiple Routers**

```JavaScript
const tour_router = app.Router();
const user_router = app.Router();

app.use('/api/v1/tours', tour_router);
app.use('/api/v1/users', user_router);

tour_router
          .route('/')
          .get(get_all_tours)
          .post(create_tour)

tour_router
          .route('/:id')
          .get(get_tour_by_id)
          .patch(update_tour)
          .delete(delete_tour)

user_router
          .route('/')
          .get(get_all_users)
          .post(create_user)

user_router
          .route('/:id')
          .get(get_user_by_id)
          .patch(update_user)
          .delete(delete_user)
```

---

## [Lecture 63](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064884)

### **A Better File Structure**

Refactoring the Natours project.

---

## [Lecture 64](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064886)

### **Param Middleware**

```JavaScript
// An example of a parameter middleware function
router.param('id', (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  next();
});

/* We will use this middleware function to check for a valid ID
   in the request, instead of checking for it in each function
   that relies on an ID */
exports.check_id = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    /* The return statement is vital, without it, express would send
       the response and continue with the next middleware function */
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  next();
};
```

---

## [Lecture 65](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064888)

### **Chaining Multiple Middleware Functions**

```JavaScript
/* To chain two middleware functions, we add them both 
   into the handler stack */
router.post(tour_controller.check_body, tour_controller.create_tour);
```

---

## [Lecture 66](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064890)

### **Serving Static Files**

```JavaScript
const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public`));

app.listen(8000);
```

Let's say for example that we want to access `overview.html` that is located in `./public`, we would go to the following URL:

<localhost:8000/overview.html>

Why is it not <localhost:8000/public/overview.html>?

If we request a URL that it cannot find in any of our routes, it will then look in the `./public` directory
that we defined in `express.static(<path>)`, and it sets that directory to the root.

---

## [Lecture 67](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064894)

### **Environment Variables**

Environment variables are global variables that are used to define the environment in which a Node app is running.

Node.js & express apps can run in different environments, the most important ones are:

- Development
- Production

By default, express sets the environment to development.

We can access environment variables by:

```JavaScript
// express environment
console.log(app.get('env'));

// Node environment
console.log(process.env);
```

Setting an environment variable from the terminal:

```PowerShell
# If we want to set an environment variable in the terminal:

# In windows
~$ set NODE_ENV=development

# Linux / Mac
~$ NODE_ENV=development
```

We can define the following scripts in `package.json` to start the application
in either a development or production environment:

```JSON
{
  "scripts": {
    // dev environment
    "start:dev": "nodemon server.js",
    // production environment
    "start:prod": "set NODE_ENV=production && nodemon server.js"
  },
}
```

We can also use environment variables for configuration of variables that may change depending
on the environment that the app is running in. For example, we may use different databases for
development and testing vs production. We could define an environment variable for each and then
activate the correct DB depending on the environment.

We can define the environment variables in a `.env` file, in this case `config.env`, the contents may look something like this:

```.env
NODE_ENV=development
PORT=8000
```

To use these environment variables in our application, one method is using the node module `dotenv`

```PowerShell
~$ npm i dotenv
```

```JavaScript
const dotenv = require('dotenv');

// Get the variables from the config file & save them as Node environment variables
dotenv.config({ path: `${__dirname}/config.env` });

// Only log if we are in development
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Get the port from the config
server.listen(process.env.PORT);

```

## [Lecture 68](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064896)

### **Setting Up [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/docs/en/index.html) in VS Code**

We will install the following dev dependencies:

| Package                | Reason                                               |
|:-----------------------|:-----------------------------------------------------|
| eslint                 |                                                      |
| prettier               |                                                      |
| eslint-config-prettier | Disable formatting for ESLint, use prettier instead  |
| eslint-plugin-prettier | Allow ESLint to show formatting errors using prettier|
| eslint-config-airbnb   | JS style guide                                       |
| eslint-plugin-node     | Node specific errors                                 |
| eslint-plugin-import   | Needed for airbnb style guide                        |
| eslint-plugin-jsx-a11y | Needed for airbnb style guide                        |
| eslint-plugin-react    | Needed for airbnb style guide                        |

```PowerShell
~$ npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

Config files for Prettier & ESLint:

- `.prettierrc`

```JSON
{
  "singleQuote": true
}
```

- `.eslintrc.json`

```JSON
{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "linebreak-style": ["windows"],
    "prettier/prettier": "error",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "warn",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
  }
}
```

---
