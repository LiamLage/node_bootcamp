# Section 9 - Error Handling with Express

---

## [Lecture 110](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064534)

### **Section Intro**

---

## [Lecture 111](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065196)

### **Debugging Node.js with ndb**

[ndb - npm](https://www.npmjs.com/package/ndb)

[ndb - Github](https://github.com/GoogleChromeLabs/ndb)

```Bash
~$ npm i ndb --global
```

I will be installing it locally as a dev dependency.

```Bash
~$ npm i ndb --save-dev
```

---

## [Lecture 112](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065200)

### **Handling Unhandled Routes**

```JavaScript
// Unhandled Route Response
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Can't find ${req.originalUrl}`,
  });
  next();
});
```

---

## [Lecture 113](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065202)

### **An Overview of Error Handling**

| Operational Errors                                                                          | Programming Errors                              |
| :------------------------------------------------------------------------------------------ | :---------------------------------------------- |
| Problems that we can predict will happen at some point so we need to handle them in advance | Bugs that developers introduce into our program |
| - Invalid Path Accessed                                                                     | Reading Properties on `Undefined`               |
| - Invalid User Input                                                                        | Passing an Invalid Type                         |
| - Failed to Connect to Server                                                               | Using Async without Await                       |
| - Failed to Connect to Database                                                             | Using `req.query` instead of `req.body`         |
| - Request Timeout                                                                           | etc...                                          |
| - etc...                                                                                    |                                                 |

---

## [Lecture 114](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065206)

### **Implementing a Global Error Handling Middleware**

```JavaScript
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = 'failed';
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
```

---

## [Lecture 115](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065208)

### **Better Errors & Refactoring**

In `utils/app_error.ts`:

```TypeScript
// https://devdocs.io/javascript/classes/extends
class App_Error extends Error {
  statusCode: any;
  status: string;
  isOperational: boolean;
  constructor(message:string, statusCode:any) {
    super(message); // https://devdocs.io/javascript/operators/super

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default App_Error;
```

In `controller/error_controller.ts`:

```TypeScript
import { Request, Response, NextFunction } from 'express'

const error_handler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default error_handler
```

In `app.ts`:

```TypeScript
import AppError from './utils/app_error';
import global_error_handler from './controllers/error_controller'

// Unhandled Route Response
app.all('*', (req:Request, res:Response, next:NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// Error Handling
app.use(global_error_handler);
```

---

## [Lecture 116](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065210)

### **Catching Errors in Async Functions**

We want to send the errors from our async functions to the global error handler instead of having a try/catch block in each function.

In `utils/catch_async.ts`

```TypeScript
import { Request, Response, NextFunction } from 'express'

const catch_async = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catch_async
```

In `controllers/tour_controller.ts`

```TypeScript
import catch_async from '../utils/catch_async';

// Wrap each async function inside the catch_async function, for example:
export const get_tour = catch_async(async (req: Request, res: Response, next: NextFunction) => {
  const db_con = await conn;
  const db = db_con.collection('tours');

  const id = new ObjectId(req.params.id);

  const filter = {
    _id: id,
    secret_tour: {
      $ne: true,
    },
  };
  const tour = await db.findOne(filter);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
```

---

## [Lecture 116](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065212)

### **Adding 404 Not Found Errors**

We will use `get_tour_by_id` as an example, however we will apply this to all functions that take the tour ID parameter,
including `update_tour` & `delete_tour`.

If we call get_tour_by_id on 172.17.83.33:8000/api/v1/tours/ID with an invalid ID, we get the following error:

```JSON
{
    "status": "error",
    "message": "Argument passed in must be a string of 12 bytes or a string of 24 hex characters"
}
```

However if we call it with a valid ID that does not exist, such as `62334a7fbed5ddf78273fc80`, we get the following:

```JSON
{
    "status": "success",
    "data": {
        "tour": null
    }
}
```

We instead want to get the status 'failed' & an error. Note how a valid ID that does not exist returns the tour as null,
so in `tour_controller.ts`, we can do the following:

```TypeScript
export const get_tour = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db_con = await conn;
    const db = db_con.collection('tours');

    const id = new ObjectId(req.params.id);

    const filter = {
      _id: id,
      secret_tour: {
        $ne: true,
      },
    };
    const tour = await db.findOne(filter);

    // Send an error if the ID is valid but does not exist in the DB
    if(!tour) {
      return next(new AppError(`No tour found with ID: ${id}`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }
);
```

---

## [Lecture 118](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065216)

### **Errors During Development vs Production**

In `controllers/error_controller.ts`:

In development we want to send the full error as well as the stack trace, however in production we only want to send the error
& status.

```TypeScript
import { Request, Response, NextFunction } from 'express';

const send_error_dev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const send_error_production = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  // Programming or other unknown error: don't leak error details
  } else {
    // Log error
    console.error(`ERROR: ${err}`)

    // Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.'
    })
  }
};

const error_handler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    send_error_dev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    send_error_production(err, res);
  }
};

export default error_handler;
```

---

## [Lecture 119](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065218)

### **Handling Invalid Database IDs**

```TypeScript
const handle_db_id_error = () => {
  const message = 'Invalid ID';
  return new AppError(message, 400);
};

const error_handler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    send_error_dev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (
      error.message ===
      'Argument passed in must be a string of 12 bytes or a string of 24 hex characters'
    )
      error = handle_db_id_error();

    send_error_production(error, res);
  }
};
```

---

## [Lecture 120](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065218)

### **Handling Duplicate Database Fields**

```TypeScript
const handle_db_duplicate_fields = (error: any) => {
  const message = `Duplicate Error: Field '${Object.keys(
    error.keyValue
  )}' with value '${error.keyValue.name}' already exists.`;
  return new AppError(message, 400);
};

const error_handler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    send_error_dev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    console.log(error);
    if (
      error.message ===
      'Argument passed in must be a string of 12 bytes or a string of 24 hex characters'
    ) {
      error = handle_db_id_error();
    }
    if (error.code === 11000) error = handle_db_duplicate_fields(error);

    send_error_production(error, res);
  }
};
```

---

## [Lecture 121](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065222)

### **Handling Validation Errors**

```TypeScript
const validate_input = async (item: any) => {
  // Set default rating values
  if (item.name === null || !item.name) {
    throw new AppError('ValidationError: Name is Required.', 400);
  }
  if (
    item.ratings_average === null ||
    !item.ratings_average ||
    item.ratings_average > 5 ||
    Number.isNaN(item.ratings_average)
  ) {
    item.ratings_average = 4.5;
    throw new AppError(
      'ValidationError: Ratings Average Required, Rating Average must be less than 5.',
      400
    );
  }

  if (
    item.ratings_quantity === null ||
    !item.ratings_quantity ||
    Number.isNaN(item.ratings_quantity)
  ) {
    item.ratings_quantity = 0;
    // throw new AppError('ValidationError: Ratings Quantity Required', 400)
  }

  if (item.difficulty && typeof item.difficulty !== 'number') {
    item.difficulty = item.difficulty.toLowerCase();
    if (
      item.difficulty !== 'easy' &&
      item.difficulty !== 'medium' &&
      item.difficulty !== 'difficult'
    ) {
      throw new AppError(
        "ValidationError: Difficulty must be 'easy', 'medium' or 'difficult'.",
        400
      );
    }
    if (typeof item.difficulty === 'number') {
      throw new AppError(
        "ValidationError: Difficulty cannot be a number, it must be 'easy', 'medium' or 'difficult'.",
        400
      );
    }
  }

  // Set default date
  if (item.created_on === null || !item.created_on)
    item.created_on = new Date().toISOString();

  // Trim strings
  item.summary = item.summary.trim();
  item.description = item.description.trim();

  const db_con = await conn;
  const db = db_con.collection('tours');
  await db.createIndex({ name: 1 }, { unique: true });
  return item;
};
```

---

## [Lecture 122](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065226)

### **Errors Outside Express: Unhandled Rejections**

Unhandled rejections will be caught from any of the files in our project.

In general we should handle all promise rejections & not rely on the 'catch-all' method below.

In `server.ts`:

```TypeScript
process.on('unhandledRejection', (err: Record<string, unknown>) => {
  throw new Error(`Unhandled Rejection! ${err.name} ${err.message}`);
});
```

---

## [Lecture 123](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065228)

### **Catching Uncaught Exceptions**

Uncaught exceptions will be caught from any of the files in our project.

In general we should handle all exceptions & not rely on the 'catch-all' method below.

In `server.ts`:

```TypeScript
process.on('uncaughtException', (err: Record <string, unknown>) => {
  throw new Error(`Uncaught Exception! ${err.name}: ${err.message}.`);
});
```

---
