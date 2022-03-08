# Section 2 - Introduction to Node.js & NPM

____________________________________________________________

## [Lecture 6](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080912)

### **Running Javascript Outside the Browser**

Node REPL:
In the terminal type node

Press `tab` to see available global variables

To see methods & properties available to a constructor:

```PowerShell
# Enter the node REPL
> node
# See methods & properties
> String.<tab>
```

____________________________________________________________

## [Lecture 7](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080914)

### **Using Modules 1: Core Modules**

[Node Documentation](https://nodejs.org/dist/latest-v16.x/docs/api/)

____________________________________________________________

## [Lecture 8](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080916)

### **Reading & Writing Files**

In this lecture we cover synchronous reading & writing of files.

```JavaScript
// Synchronous reading & writing of files
const fs = require('fs');

// Read file
textIn = fs.readFileSync(path: 'path', encoding: 'utf-8');
textOut = fs.writeFileSync(path: 'path', encoding: 'utf-8')
```

____________________________________________________________

## [Lecture 9](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080918)

### **Blocking & Non-Blocking: Asynchronous Nature of Node.js**

A Node.js process is single threaded, thus as a developer it is our duty to write asynchronous, non-blocking code. One method of doing this is with callbacks, however this can quickly lead to 'callback hell'. We will cover promises & async await in a future lecture (section 5).

____________________________________________________________

## [Lecture 10](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080922)

### **Reading & Writing Files Asynchronously**

One method of reading & writing files asynchronously is with the use of callback functions.

```JavaScript
// Asynchronous reading & writing of files
const fs = require('fs');

// Read file
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  if(err) {
    console.error({error});
    return;
  }
  else {
    console.log(data);
  }
});
```

____________________________________________________________

## [Lecture 11](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080926)

### **Creating a Simple Web Server**

Below we create a simple web server and display a welcome message on the homepage

```JavaScript
const http = require('http');

// The callback will be triggered each time there is a new request
const server = http.createServer((req, res) => {
  res.end('Hello from the server');
});

// The server is on localhost, port 8000
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on port 8000');
});
```

____________________________________________________________

## [Lecture 12](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080928)

### **Routing**

Below we handle basic routing based on the url, for example `127.0.0.1:8000/overview`

```JavaScript
const http = require('http');

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Below we display different pages based on the url
  if(pathName === '/overview') {
    res.end('Overview page');
  } else if(pathName === '/product') {
    res.end('Product page');
  } else if(pathName === '/') {
    res.end('Homepage');
  } else {
    // If the page doesn't exist, we send a header with the response code & content type
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end(
      `<h1>404</h1>
       <p1>Not Found</p1>
       <a href="/">Return to home page</a>
      `
    );
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on port 8000');
});
```

____________________________________________________________

## [Lecture 13](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080930)

### **Building a (very) simple API**

A note about reading & writing files; when specifying the file path, instead of starting with `./`, we can instead use `__dirname` which refers to the directory in which the script that we are currently executing is located.

Initially we were reading the file in the callback function each time `/api` was called, a more efficient way of doing it is to synchronously read the file before we start the server & keep the data in a var which we can then refer to each time `/api` is called.

```JavaScript
const fs = require('fs');
const http = require('http');

// Original method
// In this configuration the file is read each time the callback is triggered
const server = http.createServer((req, res) => {
  const pathName = req.url;

  if(pathName === '/api') {
    fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8' (err, data) => {
      const dataObj = JSON.parse(data);
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
    });
  }
});

// Revised Method
// In this configuration the file is read synchronously before we start the server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if(pathName === '/api') {
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(data);
  }
});
```

____________________________________________________________

## [Lecture 14](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080934)

### **HTML Templating: Building the Templates**

Note that the HTML & CSS was provided in the course material, I did not write it myself.

____________________________________________________________

## [Lecture 15](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080938)

### **HTML Templating: Filling the Templates**

In this lecture we fill in placeholders in the templates which will be replaced by the ```replace_template(template, product)``` function.

____________________________________________________________

## [Lecture 16](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080942)

### **Parsing Variables from URLs**

```JavaScript
const url = require('url')

const server = http.createServer((req, url) => {
  console.log(req.url);
  console.log(url.parse(req.url, true));

  // Output
  /product?id=0
  Url {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '?id=0',
    query: [Object: null prototype] { id: '0' },
    pathname: '/product',
    path: '/product?id=0',
    href: '/product?id=0'
  }

  // Parse the url
  const { query, pathname } = (url.parse(req.url, true));

  if(pathname === '/product') {
  res.writeHead(200, {'Content-type': 'text/html'});  // Specify the response code & content type
  const product = data_obj[query.id];  // Get the product in the array at index 'query.id'
  const output = replace_template(template_product, product);
  
  res.end(output);

});
```

____________________________________________________________

## [Lecture 17](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080944)

### **Using Modules 2: Our Own Modules**

We will move the `replace_template()` function to its own file, then export the function using `module.exports`. We can then import this module in
 our project using `require('./modules/replace_template')` & make use of the `replace_template()` function.

```JavaScript
module.exports = (template, product) => {
  /* There may be multiple instances of {%PRODUCT%}, so we wrap it
     in a regEx with the 'g' flag to make it global, then all
     instances will be replaced, not just the first one.
  */
  let output = template.replace(/{%PRODUCT_NAME%}/g, product.product_name);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ORIGIN%}/g, product.origin);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if(!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};
```

____________________________________________________________

## [Lecture 18](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080946)

### **Introduction to NPM & the package.json File**

[NPM](https://www.npmjs.com/)

```PowerShell
~$ npm init
# Follow CLI Prompts
```

____________________________________________________________

## [Lecture 19](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080948)

### **Types of Packages & Installs**

```PowerShell
# To install a local dependency:
~$ npm intall <pkg_name>

# To install a local dev dependency:
~$ npm install <pkg_name> --save-dev

# To install a global dependency:
~$ npm install <pkg_name> --global
```

____________________________________________________________

## [Lecture 20](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080950)

### **Using Modules 3: Third Party Modules**

We will be using [slugify](https://www.npmjs.com/package/slugify) as an example.

```PowerShell
# Install slugify
~$ npm i slugify
```

It will be added to our project dependencies in package.json

usage:

```JavaScript
const slugify = require('slugify');

// map() creates a new array populated with the results of calling slugify on every element in the calling array.
const slugs = data_obj.map(element => slugify(element.product_name, {lower: true}));
console.log(slugs);
```

____________________________________________________________

## [Lecture 21](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080956)

### **Package Version Control & Updating**

Most of the packages on NPM follow the semantic version notation:

1.18.11

'1' - major version. This version is for new releases & may include breaking changes.

'18' - minor version. This version introduces new features, but does not include breaking changes, minor versions will be backward compatible.

'11' - patch version. This version is for bug fixes.

### Updating Packages

```PowerShell
# To see outdated packages
~$ npm outdated

# To install a package at a specified version number
~$ npm install <pkg_name>@<version>
# For example:
~$ npm install slugify@1.0.0
```

In our package.json, we can specify which version updates we will accept:

```JSON
"dependencies": {
  "slugify": "^1.3.4",
  "nodemon": "~2.0.15"
}
```

`^` will accept patches & minor releases.

`~` will only accept patch releases.

`*` will accept all versions, meaning major, minor & patch.

### Uninstall Modules

```PowerShell
# To uninstall a package run:
~$ npm uninstall <pkg_name>
```

### Install All Dependencies

```PowerShell
# Install all dependencies in package.json
~$ npm install
```

`package-lock.json` contains fixed versions of all dependencies.

____________________________________________________________

## [Lecture 22](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080962)

### **Setting up Prettier in VS Code**

____________________________________________________________

## [Lecture 23](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080964)

### **Recap & What's Next**

____________________________________________________________
