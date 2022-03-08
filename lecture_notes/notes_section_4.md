# Section 4 - How Node.js Works: A Look Behind the Scenes

---

## [Lecture 29](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064550)

### **Section Intro**

---

## [Lecture 30](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064738)

### **Node, V8, Libuv & C++**

### Important Node Dependencies

- [V8](https://nodejs.org/dist/latest-v16.x/docs/api/v8.html) JavaScript Engine (C++ & JS)

  - Converts JS into machine code at runtime

- Libuv (C++)

  - Asynchronous IO
  - Gives Node Access to the Underlying OS
    - File System
    - Networking
    - etc
  - Implements the Event Loop & Thread Pool

- http-parser
- c-ares - DNS
- OpenSSL - Cryptography
- [zlib](https://nodejs.org/dist/latest-v16.x/docs/api/zlib.html) - Compression

---

## [Lecture 31](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064740)

### **Processes, Threads & the Thread Pool**

As discussed in previous lectures, Node.js is single threaded, hence the importance of non-blocking,
asynchronous programming. Some tasks are too intensive to run inside the event loop without blocking
the single thread. They will be automatically offloaded to the thread pool.

Below is an overview of the Node process:

- Node.js Process
  - Single Thread (Sequence of Instructions)
    - Initialize program
    - Execute 'top level' code - everything that is not inside a callback function
    - Require Modules
    - Register event callbacks
    - Start Event Loop
- Thread Pool
  - Up to 128 additional threads
  - Standard is 4 additional threads
  - Event Loop can automatically offload intensive tasks to the thread pool
    - File system
    - Cryptography
    - Compression
    - DNS Lookup

---

## [Lecture 32](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064744)

### **The Node.js Event Loop**

[Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

[Resources](https://nodejs.dev/learn/the-nodejs-event-loop)

The event loop is what makes asynchronous programming possible in Node.js.

Guidelines to not block the event loop:

- Don't use **`sync`** versions of functions in fs, crypto & zlib modules in your callback functions.
- Don't perform complex calculations (e.g. nested loops, complex arithmetic).
- Be careful with JSON in large objects.
- Don't use complex regular expressions (e.g. nested quantifiers).
- There are solutions to these blocking problems, like manually offloading to the thread pool,
  or using child processes.

All code that is inside callback functions is executed within the event loop, while some intensive
tasks may be offloaded to the thread pool as we saw in the previous lecture.

One loop is known as a tick, on completion of the tick, if there are any pending timers or I/O
tasks, the event loop will continue, otherwise the program will exit

Event-Driven Architecture:

- Events are emitted
- Event loop picks them up
- Callbacks are called

Event Loop Queues (In order of when they will be processed):

- Expired Timer callbacks

  - For example, from a `setTimeout()` function:

    ```JavaScript
    setTimeout(() => {
      console.log('Timer expired!');
    });
    ```

- I/O Polling callbacks

  - For example, reading a file:

    ```JavaScript
    fs.readFile('file.txt', (err, data) => {
      console.log(`File read:\n${data}`);
    });
    ```

- `setImmediate` callbacks

  - These callbacks wil be executed immediately after the I/O Polling

- Close callbacks

  - i.e When a server or socket closes

- `process.nextTick()`

  - Will be executed on completion of the current phase

- Other Microtasks (Resolved Promises)

  ```JavaScript
  some_promise.then((data) => {
    console.log(`Received data:\n${data}`)
  })
  ```

  - Will be executed on completion of the current phase

---

## [Lecture 33 (Practical)](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064746)

### **The Event Loop in Practice**

---

## [Lecture 34](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064748)

### **Events & Event-Driven Architecture**

---

## [Lecture 35](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064750)

### **Events in Practice**

---

## [Lecture 36](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064752)

### **Introduction to Streams**

Streams are used to process (read & write) data piece by piece, without completing the whole
read or write operation, and therefore without keeping all the data in memory.

Streams are instances of the `EventEmitter` class.

| Streams   | Description                                                 | Example                          | Important Events                                                                                        | Important Functions |
| --------- | :---------------------------------------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------ |
| Readable  | Streams from which we can read (consume) data               | http requests, fs read streams   | - `data` emitted when there is new data to consume, `end` emitted when there is no more data to consume | `pipe()`, `read()`  |
| Writable  | Streams to which we can write data                          | http responses, fs write streams | `drain` `finish`                                                                                        | `write()`, `end()`  |
| Duplex    | Streams that are both readable & writable                   | net web socket                   |                                                                                                         |                     |
| Transform | Duplex streams that transform data as it is written or read | zlib Gzip creation               |                                                                                                         |

---

## [Lecture 37](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064754)

### **Streams in Practice**

---

## [Lecture 38](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064756)

### **How Requiring Modules Works**

- Each JavaScript file is treated as a separate module
- Node.js uses the **CommonJS module system**: `require()`, `exports` or `module.exports`
- **ES module system** is used in browsers: `import`/`export`

What happens when we `require()` a module

- Path is resolved and the file is loaded
  1. Start with **core modules**
  2. If it begins with './' or '../' --> Try to **load developer module**
  3. If no file is found --> Try to **find folder** with index.js in it
  4. Else --> Go to **node_modules/** and try to find the module there.

```JavaScript
// Core modules
require('http');

// Developer Modules - controller is an example
require('./lib/controller');

// 3rd-party modules (from NPM)
require('express');
```

- Wrapping
  - Keeps top-level variables that we define in modules private (scoped only to the current module)
  1. **require** function to require modules
  2. **module**: reference to the current module
  3. **exports**: a reference to `module.exports`, used to export object from a module
  4. **__filename**: absolute path of the current module's file
  5. **__dirname**: directory name of the current module

```JavaScript
// Immediately Invoked Function Expression (IIFE)
(function(exports, require, module, __filename, __dirname) {
  // module code lives here
});
```

- Execution
  - The code in the module's wrapper function gets executed by the Node.js runtime
- Returning Exports (explained in lecture 39)
  - require function returns **exports** of the required module
  - `module.exports` is the returned object
  - Use `module.exports` tp export one single variable e.g. one class or one
  function (`module.exports = Calculator;`)
  - Use `exports` to export multiple named variables (`exports.add = (a, b) =>
  a + b`)
  - This is how we import data from one module into another
- Caching
  - Modules are cached after the first time they are loaded. If you `require()`
  a module multiple times, you will always get the same result, and the code
  in the module is only executed in the first call, in subsequent calls the
  result is retrieved from cache.

---

## [Lecture 39](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064754)

### **Requiring Modules in Practice**

---
