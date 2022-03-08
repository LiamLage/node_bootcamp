/* Author: Liam Lage
	 Date:   08/03/2022

	 Description:
	 Modules in Practice
*/

// console.log(arguments);	// arguments is an array of values that are passed into a function
// console.log(require('module').wrapper);	// use .wrapper to see the wrapper function

// module.export
const C = require('./test_module_1');
const calc_1 = new C();
console.log(calc_1.add(2, 5));

// exports
// const calc_2 = require('./test_module_2');
// console.log(calc_2.add(2, 5));
const {multiply, divide } = require('./test_module_2');
const test_module_3 = require('./test_module_3');
console.log(divide(2, 5));

/* Caching
   The function in test_module_3 is only executed once,  on the
	 first require(), on subsequent calls the result is retrieved
	 from cache
*/
require('./test_module_3')();
require('./test_module_3')();
require('./test_module_3')();