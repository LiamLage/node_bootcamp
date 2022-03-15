exports.tour_schema = {
  bsonType: 'object',
  required: [ "name", "duration", "max_group_size", "difficulty", "price", "summary", "image_cover" ],
  properties: {
    name: {
      bsonType: 'string',
      description: 'name must be a string & is required',
    },
    duration: {
      bsonType: 'number',
      description: 'duration must be a number & is required',
    },
    max_group_size: {
      bsonType: 'number',
      description: 'max_group_size must be a number & is required',
    },
    difficulty: {
      bsonType: 'string',
      enum: ['easy', 'medium', 'difficult'],
      description:
        "difficulty must be a string, either 'Easy', 'Medium' or 'Difficult' & is required",
    },
    ratings_average: {
      bsonType: 'number',
      description: 'rating_average must be a number',
    },
    ratings_quantity: {
      bsonType: 'number',
      description: 'rating_quantity must be a number',
    },
    price: {
      bsonType: 'number',
      description: 'price must be a number & is required',
    },
    price_discount: {
      bsonType: 'number',
      description: 'price_discount must be a number',
    },
    summary: {
      bsonType: 'string',
      description: 'summary must be a string & is required',
    },
    description: {
      bsonType: 'string',
      description: 'description must be a string',
    },
    image_cover: {
      bsonType: 'string',
      description: 'image_cover must be a string & is required',
    },
    images: {
      bsonType: ['string'],
    },
    created_on: {
      bsonType: 'date',
    },
    start_dates: {
      bsonType: ['date'],
    },
  },
};

// module.exports = tour_schema;
