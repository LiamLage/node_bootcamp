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

// Convert the string object into int if they exist
const correct_filter = (input) => {
  if(input.duration) input.duration = parseInt(input.duration);
  if(input.max_group_size) input.max_group_size = parseInt(input.max_group_size);
  if(input.ratings_average) input.ratings_average = parseInt(input.ratings_average);
  if(input.ratings_quantity) input.ratings_quantity = parseInt(input.ratings_quantity);
  if(input.price) input.price = parseInt(input.price);

  return input;
};

exports.get_all_tours = async (
  { max_results = Number.MAX_SAFE_INTEGER },
  filter
) => {
  const corrected_filter = correct_filter(filter);

  // Find the tours that match the filter, or all of them if there is no filter
  const cursor = collection.find(corrected_filter).limit(max_results);

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
  // Filtering with a regex
  let query_str = JSON.stringify(query_obj);
  query_str = query_str.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // \b will match only exactly, 'g' means it will occur multiple times
  // { difficulty: 'easy', duration: { gte: '5' } }
  // { difficulty: 'easy', duration: { $gte: 5 } }
  // gte, gt, lte, lt
```

---
