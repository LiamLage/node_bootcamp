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

## [Lecture 44](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064804)

### **Consuming Promises with Async/Await**

[Modern Asynchronous JavaScript with Async and Await](https://nodejs.dev/learn/modern-asynchronous-javascript-with-async-and-await)

---

## [Lecture 45](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064806)

### **Returning Values from Async Functions**

Consider the situation below:

```JavaScript
const get_dog_url = async () => {
  const data = await read_file_promise(`${__dirname}/dog_img.txt`);

  console.log(`URL: ${data}`);
  return data;
}

console.log('1: Will get URL');
const result = get_dog_url();
console.log(result);
console.log('2: Done getting URL');
```

The output will be:

```PowerShell
> 1: Will get URL
> Promise { <pending> }
> 2: Done getting URL
> URL: https://images.dog.ceo/breeds/malinois/n02105162_4120.jpg
```

When logging `result` to the console, the read file operation is still executing,
so we see `Promise { <pending> }` on the console, only once the read file operation is complete, will the actual url be returned.

Instead of saving the returned value to a variable, we can instead use the `.then()` method on it, thus we get the returned value when the promise is resolved.

```Javascript
const get_dog_url = async () => {
  try {
    const data = await read_file_promise(`${__dirname}/dog_img.txt`);

    console.log(`URL: ${data}`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

console.log('Will get URL');
get_dog_url().then(result => {
  console.log(result);
  console.log('Done getting URL');
})
.catch(err => {
  console.error(`ERROR: ${err}`);
})
```

```JavaScript
/* Immediately Invoked Function Expression 
   That gets the URL as above, but makes
   use of async/await instead of .then() &
   .catch()
*/
(async() => {
  try {
    console.log('Will get dog URL')
    const result = await get_dog_url();
    console.log(result);
    console.log('Done getting dog url');
  } catch (err) {
    console.error(`ERROR: ${err}`)
  }
});
```

---

## [Lecture 46](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064808)

### **Waiting for Multiple Promises Simultaneously**

If we want to run multiple promises concurrently, we use `Promise.all(<array of promises>)`, it creates
a promise that is resolved with an array of results when all the provided promises resolve, or rejected
when any promise is rejected.

```JavaScript
const get_dog_image = async () => {
  try {
    const data = await read_file_promise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res_1_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res_2_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    
    const res_3_promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    /* If we want to run multiple promises concurrently,
       we use Promise.all(<array of promises>), it creates
       a promise that is resolved with an array of results
       when all the provided promises resolve, or rejected
       when any promise is rejected  */
    const all = await Promise.all([res_1_promise, res_2_promise, res_3_promise]);

    // create a new array that only contains the .body.message for each promise result
    const images = all.map(element => element.body.message);
    console.log(images);

    // Write each of the URLs to dog_img, separated by a new line
    await write_file_promise(`${__dirname}/dog_img.txt`, images.join('\n'));
    console.log('Random dog image url saved to file');
  } catch (err) {
    console.error(err);
    throw(err); /* We must throw an error, otherwise the promise will still be resolved &
                   the .then() below will still be invoked. */
  }
};
```

---
