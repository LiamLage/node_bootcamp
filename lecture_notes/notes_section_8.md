# Section 8 - Using MongoDB with Mongoose

---

The course uses Mongoose, however I will handle database operations using the [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/current/).

[MongoDB with Node.js](https://www.mongodb.com/languages/mongodb-with-nodejs)

[MongoDB & Node.js Tutorial - CRUD Operations](https://www.mongodb.com/developer/quickstart/node-crud-tutorial/)

[MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/current/)

[Node.js MongoDB Native](https://mongodb.github.io/node-mongodb-native/4.4/)

[Node.js MongoDB Driver API](https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html)

[MongoDB Github Repo](https://github.com/mongodb/mongo)

---

## [Lecture 82](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064536)

### **Section Intro**

---

## [Lecture 83](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065060)

### **Connecting Our Database to the Expess App**

[Connect to a MongoDB Database Using Node.js](https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database)

[connect()](https://docs.mongodb.com/manual/reference/method/connect/)

Connect to MongoDB:

```JavaScript
const  { MongoClient } = require('mongodb');

//  Connect to MongoDB
const db_connect = async () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

  // New MongoClient instance
  const client = new MongoClient(DB);

  try {
    const con = await client.connect() // client.connect() returns a promise
    console.log(`Connection status: ${con.topology.s.state}`)
  } catch (e) {
    console.error(`DB Connection Error: ${e}`)
  }
};
```

---

## [Lecture 84](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065062)

### **What is Mongoose?**

Mongoose is a layer of abstraction over the MongoDB Driver.

---

## [Lecture 85](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065064)

### **Creating a Simple Tour Model**

```JavaScript
class Tour {
  constructor(input) {
    this.name = input.name;
    this.rating = input.rating;
    this.price = input.price;
  }
}

exports.create = async (input) => {
  input.name = input.name;
  input.rating = parseFloat(parseFloat(input.rating).toFixed(1));
  input.price = parseFloat(parseFloat(input.price).toFixed(2));
  if (
    typeof input.name != 'string' ||
    input.name === '' ||
    input.name === null
  ) {
    // console.error('Invalid name.');
    throw 'Invalid name.';
  } else if (input.rating === null || input.rating > 5 || isNaN(input.rating)) {
    // console.error('invalid rating');
    throw 'Invalid rating';
  } else if (input.price === null || isNaN(input.price)) {
    // console.error('Invalid price');
    throw 'Invalid price';
  } else {
    console.log(input);
    collection.createIndex({ name: 1 }, { unique: true });
    collection.createIndex({ rating: 1 });
    collection.createIndex({ price: 1 });

    const result = await collection.insertOne({
      name: input.name,
      rating: input.rating,
      price: input.price,
    });
    console.log(`New tour created with ID: ${result.insertedId}`);
    return result;
  }
};
```

---

## [Lecture 86](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065066)

### **Creating Documents & Testing the Model**

```JavaScript
const tour_object = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 979,
});

create_tour(validate(tour_object));
```

---

## [Lecture 87](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065070)

### **Intro to Back-End Architecture: MVC, Types of Logic & More**

**M**odel

**V**iew

**C**ontroller

---

## [Lecture 88](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065072)

### **Refactoring for MVC**

---

## [Lecture 89](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065074)

### **Another Way to Create Documents**

```JavaScript
exports.create = async (input) => {
  input.name = input.name;
  input.rating = parseFloat(parseFloat(input.rating).toFixed(1));
  input.price = parseFloat(parseFloat(input.price).toFixed(2));
  if (
    typeof input.name != 'string' ||
    input.name === '' ||
    input.name === null
  ) {
    // console.error('Invalid name.');
    throw 'Invalid name.';
  } else if (input.rating === null || input.rating > 5 || isNaN(input.rating)) {
    // console.error('invalid rating');
    throw 'Invalid rating';
  } else if (input.price === null || isNaN(input.price)) {
    // console.error('Invalid price');
    throw 'Invalid price';
  } else {
    console.log(input);
    const collection = client.db('natours').collection('tours');
    collection.createIndex({ name: 1 }, { unique: true });
    collection.createIndex({ rating: 1 });
    collection.createIndex({ price: 1 });

    const result = await collection.insertOne({
      name: input.name,
      rating: input.rating,
      price: input.price,
    });
    console.log(`New tour created with ID: ${result.insertedId}`);
    return result;
  }
};
```

---

## [Lecture 90](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065076)

### **Reading Documents**

```JavaScript
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
    console.log(`Found tour with ID: ${tour_id}`);
    return result;
  } else {
    throw `Could not find tour with ID: ${tour_id}`;
  }
};
```

---

## [Lecture 91](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065078)

### **Updating Documents**

```JavaScript
exports.update_tour_by_id = async (tour_id, updated_tour) => {
  const result = await collection.findOneAndUpdate(
    { name: tour_id },
    { $set: updated_tour }
  );
  console.log(`Updated tour with the name ${tour_id}`)
  return result;
};
```

---

## [Lecture 92](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065080)

### **Deleting Documents**

```JavaScript
exports.delete_tour_by_id = async (tour_id) => {
  const result = await collection.deleteOne({ name: tour_id });

  if (result) {
    console.log(`Deleted ${result.deletedCount} tours with name: ${tour_id}`)
    return result;
  } else {
    throw `Could not delete tour with ID: ${tour_id}`;
  }
};
```

---

## [Lecture 93](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065082)

### **Modeling the Tours**

[JSON Schema](https://json-schema.org/learn/getting-started-step-by-step.html)

```JavaScript
let tour_schema = {
  bsonType: "object",
  required: ['name', 'duration', 'max_group_size', 'difficulty', 'price', 'summary', 'image_cover'],
  properties: {
    name: {
      bsonType: "string",
      description: "name must be a string & is required"
    },
    duration: {
      bsonType: "number",
      description: "duration must be a number & is required"
    },
    max_group_size: {
      bsonType: "number",
      description: "max_group_size must be a number & is required"
    },
    difficulty: {
      bsonType: "string",
      enum: ["Easy", "Medium", "Difficult"],
      description: "difficulty must be a string, either 'Easy', 'Medium' or 'Difficult' & is required"
    },
    ratings_average: {
      bsonType: "number",
      description: "rating_average must be a number"
    },
    ratings_quantity: {
      bsonType: "number",
      description: "rating_quantity must be a number"
    },
    price: {
      bsonType: "number",
      description: "price must be a number & is required"
    },
    price_discount: {
      bsonType: "number",
      description: "price_discount must be a number"
    },
    summary: {
      bsonType: "string",
      description: "summary must be a string & is required"
    },
    description: {
      bsonType: "string",
      description: "description must be a string"
    },
    image_cover: {
      bsonType: "string",
      description: "image_cover must be a string & is required"
    },
    images: {
      bsonType: ["string"],
    },
    created_on: {
      bsonType: "date"
    },
    start_date: {
      bsonType: ["date"]
    }
  }
}
```

---

## [Lecture 94](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065084)

### **Importing Development Data**

```JavaScript
// Connect to MongoDB
const db_connect = async () => {
  try {
    const con = await client.connect();
    console.log(`Connection status: ${con.topology.s.state}`);
  } catch (e) {
    console.error(`DB Connection Error: ${e}`);
  }
};

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours_simple.json`, 'utf-8')
);

// Import Data into Database
const import_data = async () => {
  try {
    const result = await server.create_many(tours);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

// Delete All Data from Collection
const delete_all_data = async () => {
  try {
    res = await server.delete_all();
    console.log(res);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

const run = async () => {
  // console.log(process.argv[2]);
  if (process.argv[2] == '--import') {
    await db_connect();
    import_data();
  } else if (process.argv[2] == '--delete') {
    await db_connect();
    delete_all_data();
  }
};

run();
```

---

## [Lecture 95](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065086)

### **Making the API Better: Filtering**

I am using the [query-types](https://www.npmjs.com/package/query-types) library to automatically extract numeric & boolean values from the query string.

In app.js:

```JavaScript
const query_types = require('query-types');

app.use(query_types.middleware());
```

Let's say for example that you wanted to get all the tours & filter by duration & difficulty, you could make a get request like this:

`127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy`

```JavaScript
// Express automatically parses these queries, we can access them in the query object:
exports.get_all_tours = async (req, res) => {
  try {
    const query_obj = { ...req.query };
    const excluded_fields = ['page', 'sort', 'limit', 'fields'];  // For now ignore these until they are implemented later
    excluded_fields.forEach((el) => delete query_obj[el]);

    const tours = await server.get_all_tours(
      Number.MAX_SAFE_INTEGER,
      query_obj
    );
  // Send response
  res.status(200).json({
      status: 'success',
      results:
        tours.length
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

exports.get_all_tours = async (
  { max_results = Number.MAX_SAFE_INTEGER },
  filter
) => {
  const res = JSON.parse(filter)

  // Find the tours that match the filter, or all of them if there is no filter
  const cursor = collection.find(filter).limit(max_results);

  const results = await cursor.toArray();

  if (results.length > 0) {
    return results;
  } else {
    return 'No tours found';
  }
};
```

---

## [Lecture 96](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065088)

### **Making the API Better: Advanced Filtering**

```JavaScript
exports.get_all_tours = async (req, res) => {
  try {
    // Build query
    const query_obj = { ...req.query };
    const excluded_fields = ['page', 'sort', 'limit', 'fields']; // For now we will ignore these until they are implemented later
    excluded_fields.forEach((el) => delete query_obj[el]);

    let query_str = JSON.stringify(query_obj);
    query_str = query_str.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    const query = server.get_all_tours(Number.MAX_SAFE_INTEGER, query_str);

    // Execute query
    const tours = await query;
    // Send response
    res.status(200).json({
      status: 'success',
      results:
        tours.length
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
```

---

## [Lecture 97](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065090)

### **Making the API Better: Sorting**

```JavaScript
const get_sort_params = async (params) => {
  const sort_res = [];
  let direction = [];
  let sort = params.split(',');
  sort.forEach((result, i) => {
    if (sort[i].charAt(0) === '-') {
      direction[i] = -1;
      sort[i] = sort[i].replace('-', '');
    } else {
      direction[i] = 1;
    }
    sort_res[i] = {res: [sort[i]], val: direction[i]};
  });

  // Array to object
  // https://stackoverflow.com/questions/42974735/create-object-from-array
  const sort_obj = sort_res.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.res]: curr.val,
    }),
    {}
  );

  return sort_obj;
};

exports.get_all_tours = async (
  { max_results = Number.MAX_SAFE_INTEGER },
  filter
) => {
  const res = JSON.parse(filter);

  const query_obj = { ...res };
  const excluded_fields = ['sort', 'fields'];
  excluded_fields.forEach((el) => delete query_obj[el]);

  // Sorting
  if (res.sort) {
    const sort_params = await get_sort_params(res.sort);
  } else {
    sort_params = { created_on: -1 };
  }

  // Find the tours that match the filter, or all of them if there is no filter
  const cursor = collection
    .find(query_obj)
    .limit(max_results)
    .sort(sort_params)
    .project(projection_params);

  const results = await cursor.toArray();

  if (results.length > 0) {
    return results;
  } else {
    return 'No tours found';
  }
};

```

---

## [Lecture 98](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065094)

### **Making the API Better: Limiting Fields**

```JavaScript
const get_projection = async (params) => {
let show = [];
  const projection = params.split(',');
  projection.forEach((res, i) => {
  if(projection[i].charAt(0) === '-'){
    show[i] = -1;
    projection[i] = projection[i].replace('-', '');
  } else {
    show[i] = 1;
  }
    projection[i] = { res: [res], val: show[i] };
    console.log(projection[i])
  });

  // Array to object
  // https://stackoverflow.com/questions/42974735/create-object-from-array
  const projection_obj = projection.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.res]: curr.val,
    }),
    {}
  );

  return projection_obj;
};

exports.get_all_tours = async (
  { max_results = Number.MAX_SAFE_INTEGER },
  filter
) => {
  const res = JSON.parse(filter);

  const query_obj = { ...res };
  const excluded_fields = ['sort', 'fields'];
  excluded_fields.forEach((el) => delete query_obj[el]);

  // Sorting
  if (res.sort) {
    const sort_params = await get_sort_params(res.sort);
  } else {
    sort_params = { created_on: -1 };
  }

  // Limit fields
  if (res.fields) {
    const projection_params = await get_projection(res.fields);
  } else {
    projection_params = '';
  }

  // Find the tours that match the filter, or all of them if there is no filter
  const cursor = collection
    .find(query_obj)
    .limit(max_results)
    .sort(sort_params)
    .project(projection_params);

  const results = await cursor.toArray();

  if (results.length > 0) {
    return results;
  } else {
    return 'No tours found';
  }
};
```

---

## [Lecture 99](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065096)

### **Making the API Better: Pagination**

```JavaScript
// Pagination
const page = req.page * 1 || 1; // Default page is 1
const limit = req.limit * 1 || 100; // Default limit is 100
const skip = (page - 1) * limit;

if (req.page) {
  const num_tours = await collection.countDocuments();
  if (skip >= num_tours) throw new Error('This page does not exist');
}

const cursor = collection
  .find(query_obj)
  .sort(sort_params)
  .project(projection_params)
  .skip(skip)
  .limit(limit);

const results = await cursor.toArray();
```

---

## [Lecture 100](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065098)

### **Making the API Better: Ailiasing**

When the user hits `/top-5-cheap`, the first middleware - `ailias_top_tours` will be run, changing the query parameters to
limit the number of results to 5, sort by decending average rating and increasing price, it will also limit the fields to
only name, price, average rating, summary & difficulty.

```JavaScript
// In tour_routes.js
router.route('top-5-tours').get(tour_controller.alias_top_tours, tour_controller.get_all_tours);

// In tour_controller.js
exports.alias_top_tours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings_average,price';
  req.query.fields = 'name,price,ratings_average,summary,difficulty';
  next();
};
```

---

## [Lecture 101](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065100)

### **Refactoring API Features**

Now `server.js` contains only functions to connect to MongoDB & to start the server.

All query operations have been moved to `utils/api_features.js`, inside the `API_features` class.

We can now call the features of the API by:

```Javascript
const features = new API_features(collection, req.query)
  .filter()
  .sort()
  .limit_fields()
  .paginate()
```

An overview of the implementation:

```JavaScript
// utils/api_features.js
class API_features {
  constructor(query, query_string) {
    this.query = query;
    this.query_string = query_string;
  }
  filter() {
    // const collection = server.get_db();
    // filtering

    const query_obj = { ...this.query_string };
    const excluded_fields = ['sort', 'fields', 'page', 'limit'];
    excluded_fields.forEach((el) => delete query_obj[el]);

    let query_str = JSON.stringify(query_obj);
    query_str = query_str.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const filtered_query = JSON.parse(query_str);

    this.query = this.query.find(filtered_query);

    return this;
  }

  sort() {
    let sort_params;
    // Sorting
    if (this.query_string.sort) {
      sort_params = get_sort_params(this.query_string.sort);
    } else {
      sort_params = { price: -1 };
    }

    this.query = this.query.sort(sort_params);

    return this;
  }

  limit_fields() {
    let projection_params;
    // Limit fields
    if (this.query_string.fields) {
      projection_params = get_projection(this.query_string.fields);
    } else {
      projection_params = '';
    }

    this.query = this.query.project(projection_params);

    return this;
  }

  paginate() {
    // Pagination
    const page = this.query_string.page * 1 || 1; // Default page is 1
    const limit = this.query_string.limit * 1 || 100; // Default limit is 100
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit).toArray();

    return this;

  }
}
```

Then in `tour_controller.js` we do the following:

```JavaScript
exports.get_all_tours = async (req, res) => {
  try {
    // Execute query
    const features = new API_features(server.get_db(), req.query) // Create a new instance of API_features
      .filter()
      .sort()
      .limit_fields()
      .paginate();

    const tours = await features.query;
    // Send response
    res.status(200).json({
      status: 'success',
      results:
        tours.length
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
```

---

## [Lecture 102](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065102)

### **Aggregation Pipeline: Matching & Grouping**

[MongoDB Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

[MongoDB Aggregate Method](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#aggregate)

An aggregation pipeline consists of one or more stages that process documents:

- Each stage performs an operation on the input documents. For example, return the total, average,
  maximum & minimum values.
- The documents that are output from a stage are passed to the next stage.
  \_ An aggregation pipeline can return results for groups of documents. For example, return the total,
  average, maximum & minimum values.

Below we analyse some of the tour data, extracting the number of tours, total number of ratings, overall average
rating, overall average price, as well as the minimum & maximum prices.

```JavaScript
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
        {
          $match: {
            _id: { $ne: 'EASY' }, // All documents that are not easy
          },
        },
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
```

And add a new route in `tour_routes.js`

```JavaScript
router.route('/tour-stats').get(tour_controller.get_tour_stats);
```

---

## [Lecture 103](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065104)

### **Aggregation Pipeline: Unwinding & Projecting**

[$unwind (aggregation)](https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/)

In the `get_monthly_plan` located at `127.0.0.1:8000/api/v1/tours/monthly-plan/2021`, we can see an overview of
the number of tours for each month of the given year, sorted in a decending order of number of tours starting in
each month.

```JavaScript
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
            _id: 0
          }
        },
        {
          $sort: { num_tour_starts: -1 }
        }
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
```

---

## [Lecture 104](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065106)

### **Virtual Properties**

This lecture covers virtual properties of the Mongoose schema, I am using native MongoDB without a schema.

Virtual properties are not persited in the database, they are calculated instantaneously.

We calculate the duration of each tour in weeks:

```JavaScript
return duration / 7;
```

---

## [Lecture 105](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065108)

### **Document Middleware**

Using [Slugify](https://www.npmjs.com/package/slugify) to create slugs from the tour names.

<!-- ```JavaScript

``` -->

---
