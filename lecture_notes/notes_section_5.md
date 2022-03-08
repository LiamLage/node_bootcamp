# Section 5 - Asynchronous JavaScript: Promises & Async/Await

---

## [Lecture 40](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064542)

### **Section Intro**

---

## [Lecture 41](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064788)

### **The Problem with Callbacks: Callback Hell**

[Callback Hell *Not Secure](http://callbackhell.com/)

Callback hell refers to nested callbacks, which leads to code that is difficult to maintain.

---

## [Lecture 42](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064542)

### **From Callback Hell to Promises**

[Understanding JS Promises](https://nodejs.dev/learn/understanding-javascript-promises)

A promise is a proxy for a value that will eventually become available.

Once a promise has been called, it will start in a **pending state**. This means that the calling function
continues executing, while the promise is pending until it resolves, giving the calling function whatever
data was being requested.

The created promise will eventually end in a **resolved state**, or in a **rejected state**, calling the
respective callback functions (passed to `then` and `catch`) upon finishing.

---

## [Lecture 43](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064788)

### **Building Promises**

In this lecture we 'promisify' the `readFile()` & `writeFile()` functions which means we will make them
return promises instead of us passing callback functions into them.

The Promise API exposes a Promise constructor, which you initialize using `new Promise()`, `resolve()`
is the function to be called if the promise is resolved (fulfilled) & `reject()` is called if the
promise is rejected (unfulfilled).

Below we 'promisify' the `readFile()` function:

```JavaScript
const read_file_promise = (file) => {
  /* @param executor: A callback used to initialize the promise. This callback  is passed two 
     arguments: a resolve callback used to resolve the promise with a value or the result of another
     promise, and a reject callback used to reject the promise with a provided reason or error.
  */
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(`Read File Error: ${err}`);
      resolve(data);
    });
  });
};
```

---
