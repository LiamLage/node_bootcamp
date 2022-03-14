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

```JavaScript

```

---
