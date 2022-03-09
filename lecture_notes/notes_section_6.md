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
