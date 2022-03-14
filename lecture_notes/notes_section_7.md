# Section 7 - Introduction to MongoDB

---

## [Lecture 69](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064538)

### **Section Intro**

---

## [Lecture 70](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064978)

### **What is MongoDB?**

[MongoDB Documentation](https://docs.mongodb.com/)

[MongoDB Server Documentation](https://docs.mongodb.com/manual/)

[MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

[MongoDB Compass Documentation](https://docs.mongodb.com/compass/current/)

[MongoDB with Node.js](https://www.mongodb.com/languages/mongodb-with-nodejs)

[MongoDB Guides](https://docs.mongodb.com/guides/)

[MongoDB Basics Course - M001](https://university.mongodb.com/courses/M001/about)

[MongoDB for JavaScript Developers - M220JS](https://university.mongodb.com/courses/M220JS/about)

Key Features:

- **Document Based**: MongoDB stores data in documents (field-value pair data structures, NoSQL)
- **Scalable**: Easy to distribute data across multiple machines as your users & amount of data grows
- **Flexible**: No document data schema required, so each document can gave a different number & type of fields
- **Performant**:
  - Embedded data models
  - Indexing
  - Sharding
  - Flexible documents
  - Native duplication
  - etc
- Free & open-source, published under the SSPL License

Document Structure:

- **Unique ID**: Each document contains a unique ID, which acts as the primary key, it's automatically generated with the ObjectID data-type each time a new document is created.
- **Key-Value Pairs**
- **[BSON](https://www.mongodb.com/basics/bson)**: Data format MongoDB uses for data storage. Similar to JSON, but **typed**.
Data is stored in key-value pairs.
- **Embedding/Denormalizing**: Including related data into a single document. This allows for faster access and
easier data models (it's not always the best solution though).

---

## [Lecture 71](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/30747880)

### **No Need to Install MongoDB Locally**

![MongoDB No Install](C:\Users\Kurt\Documents\education\node_course\mongo_no_install.JPG)

---

## [Lecture 72](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064998)

### **Installing MongoDB on MacOS**

---

## [Lecture 73](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065000)

### **Installing MongoDB on Windows**

[MSI Installer](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.6-signed.msi)

To run MongoDB Server:

```PowerShell
# cd to the directory where MongoDB is installed
> cd C:\Program Files\MongoDB\Server\5.0\bin

# Start the MongoDB Server
> .\mongod.exe
```

To run MongoDB:

```PowerShell
# cd to the directory where MongoDB is installed
> cd C:\Program Files\MongoDB\Server\5.0\bin

# Start MongoDB
> .\mongo.exe
```

To run MongoDB from home directory, add `C:\Program Files\MongoDB\Server\5.0\bin` to system PATH environment variable, then:

```PowerShell
> mongod
```

---

## [Lecture 74](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065004)

### **Creating a Local Database**

[db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)

```PowerShell
# Start a new server instance
> mongod

# In a new window, start a MongoDB instance
> mongo

# To create a new database (natours_test) in this example, or to switch to an existing database, use the 'use' command
> use natours_test
switched to db natours_test

# 'db' refers to the current DB, 'tours' refers to the collection, 'insertOne()'
# method inserts a single document into the collection.
# We can pass a JS object into insertOne() & it will convert it to BSON
> db.tours.insertOne({ name: "The Forest Hiker", price: 297, rating: 4.7 })
{
        "acknowledged" : true,
        "insertedId" : ObjectId("622a19a7cbb3569188bf5417")
}

# Query all documents in collection 'tours'
> db.tours.find()
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }

# Show all databases
> show dbs
admin         0.000GB
config        0.000GB
local         0.000GB
natours_test  0.000GB

# To exit
> quit()
```

---

## [Lecture 75](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065008)

### **CRUD: Creating Documents**

[`db.collection.insertOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)

[`db.collections.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/)

```PowerShell
# Creating multiple documents - insertMany() takes an array of multiple objects
> db.tours.insertMany([{name: "The Sea Explorer", price: 497, rating: 4.8}, {name: "The Snow Adventurer", price: 997, rating: 4.9, difficulty: "easy"}])
{
        "acknowledged" : true,
        "insertedIds" : [
                ObjectId("622ae89a3a52880aaa207ebb"),
                ObjectId("622ae89a3a52880aaa207ebc")
        ]
}

# Query all documents in collection 'tours'
> db.tours.find()
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebb"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebc"), "name" : "The Snow Adventurer", "price" : 997, "rating" : 4.9, "difficulty" : "easy" }
```

---

## [Lecture 76](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065010)

### **CRUD: Querying (Reading) Documents**

[`db.collection.find()`](https://docs.mongodb.com/manual/reference/method/db.collection.find/)

```PowerShell
# Search in a collection with filter criteria
> db.tours.find({ name: "The Forest Hiker" })
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }

# Search for tours with a price below 500
# $lte operator means <=
> db.tours.find({ price: {$lte: 500} })
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebb"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }

# Search for multiple critera
# price < 500, rating >= 4.8
> db.tours.find({ price: {$lt: 500}, rating: {$gte: 4.8} })
{ "_id" : ObjectId("622ae89a3a52880aaa207ebb"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }

# Search for price < 500 || rating >= 4.8
> db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}} ] })
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebb"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebc"), "name" : "The Snow Adventurer", "price" : 997, "rating" : 4.9, "difficulty" : "easy" }

# If we want to project a specific field in the output
> db.tours.find({ price: {$lte: 500} }, { name: 1 })
{ "_id" : ObjectId("622a19a7cbb3569188bf5417"), "name" : "The Forest Hiker" }
{ "_id" : ObjectId("622ae89a3a52880aaa207ebb"), "name" : "The Sea Explorer" }
```

---

## [Lecture 77](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065012)

### **CRUD: Updating Documents**

[`db.collection.updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/)

[`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/)

```PowerShell
# To update a single document
# Update the price of 'The Snow Adventurer' to 597
> db.tours.updateOne({name: "The Snow Adventurer"}, {$set: {price: 597}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

# Add a new property
# Add a 'premium'property to tours with a price > 500 && rating >= 4.8
> db.tours.updateMany({ price: {$gt: 500}, rating: {$gte: 4.8} }, { $set: {premium: true} })
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

# Replace a document
> db.collection.replaceOne()
> db.collection.replaceMany()
```

---

## [Lecture 78](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065014)

### **CRUD: Deleting Documents**

[`db.collection.deleteOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/)

[`db.collection.deleteMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/)

```PowerShell
# Delete all documents with a rating < 4.8
> db.tours.deleteMany({ rating: {$lt: 4.8} })
{ "acknowledged" : true, "deletedCount" : 1 }

# Delete all documents in the DB
db.tours.deleteMany({})
```

---

## [Lecture 79](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065016)

### **Using Compass App for CRUD Operations**

[MongoDB Compass Documentation](https://docs.mongodb.com/compass/current/)

---

## [Lecture 80](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065022)

### **Creating a Hosted Database with Atlas**

[MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/getting-started/)

---

## [Lecture 81](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065024)

### **Connecting to Our Hosted Database**

---
