/* Author: Liam Lage
	 Date:    DATE

	 Description:
	  test_module_1
*/

// class Calculator {
// 	add(a, b) {
// 		return a + b;
// 	}

// 	multiply(a, b) {
// 		return a * b;
// 	}

// 	divide(a, b) {
// 		return a / b;
// 	}
// };

module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
