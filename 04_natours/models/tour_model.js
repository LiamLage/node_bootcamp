const mongodb = require('mongodb');
server = require(`${__dirname}/../server`)

class Tour {
  constructor(input) {
    this.name = input.name;
    this.rating = input.rating;
    this.price = input.price;
  }
}

