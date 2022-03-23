# Section 10 - Authentication, Authorization & Security

---

## [Lecture 124](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064532)

### **Section Intro**

---

## [Lecture 125](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065280)

### **Modeling Users**

---

## [Lecture 126](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065286)

### **Creating New Users**

```TypeScript
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import DB from '../mongopool';
import config from '../config/config';
import AppError from '../utils/app_error';
import catch_async from '../utils/catch_async';

const client = new DB({
  url: config.mongo.devurl,
  dbname: config.mongo.dbname,
});

const conn = client.connect();

const validate_input = async (
  name: string,
  email: string,
  password: string,
  password_confirm: string
) => {
  const db = await conn;
  const col = db.collection('users');

  // Validate name
  if (typeof(name) !== 'string' || !name || name === '') {
    throw new AppError('ValidationError: Name is required.', 400);
  }

  // Validate email
  if (
    typeof(email) !== 'string' ||
    !email ||
    email === '' ||
    !validator.isEmail(email)
  ) {
    throw new AppError('ValidationError: Valid Email is required.', 400);
  }

  // Validate password
  if (typeof password !== 'string' || !password || password === '') {
    throw new AppError('ValidationError: Password is required.', 400);
  }

  // Validate password confirmation
  if (
    typeof(password_confirm) !== 'string' ||
    !password_confirm ||
    password_confirm === ''
  ) {
    throw new AppError('ValidationError: Password is required.', 400);
  }

  if (!validator.equals(password, password_confirm)) {
    throw new AppError('Validation Error: Passwords do not match.', 400);
  }

  // Ensure email is lowercase & trim trailing whitespace
  email = email.toLowerCase().trim();

  await col.createIndex({ email: 1 }, { unique: true });

  const user = {
    name,
    email,
    password,
    password_confirm,
  };
  return user;
};

const signup = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    const user = await validate_input(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.email
    );
    const result = await col.insertOne(user);

    res.status(201).json({
      status: 'success',
      data: {
        message: result,
        user,
      },
    });
  }
);
```

---

## [Lecture 127](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065288)

### **Managing Passwords**

In `auth_controller.ts - validate_input()`:

```TypeScript
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import DB from '../mongopool';
import config from '../config/config';
import AppError from '../utils/app_error';
import catch_async from '../utils/catch_async';

const client = new DB({
  url: config.mongo.devurl,
  dbname: config.mongo.dbname,
});

const conn = client.connect();

const verify_pass = async (user: string, pass: string) => {
  try {
    const db = await conn;
    const col = db.collection('users');

    // Get the current password
    const cursor = await col
      .find({ email: user, password: pass })
      .project({ password: 1 })
      .toArray();
    const str = cursor[0];

    // If the password is unmodified, return
    if (str) {
      if (validator.equals(str.password, pass)) {
        return null;
      }
    }

    // If its a new password, hash it
    const password = await bcrypt.hash(pass, 12);

    return password;
  } catch (err) {
    throw new AppError(`Password hash error: ${err}`, 400);
  }
};

const validate_input = async (
  name: string,
  email: string,
  password: string,
  password_confirm: string
) => {
  const db = await conn;
  const col = db.collection('users');

  // Validate name
  if (typeof(name) !== 'string' || !name || name === '') {
    throw new AppError('ValidationError: Name is required.', 400);
  }

  // Validate email
  if (
    typeof(email) !== 'string' ||
    !email ||
    email === '' ||
    !validator.isEmail(email)
  ) {
    throw new AppError('ValidationError: Valid Email is required.', 400);
  }

  // Validate password
  if (typeof password !== 'string' || !password || password === '') {
    throw new AppError('ValidationError: Password is required.', 400);
  }

  // Validate password confirmation
  if (
    typeof(password_confirm) !== 'string' ||
    !password_confirm ||
    password_confirm === ''
  ) {
    throw new AppError('ValidationError: Password is required.', 400);
  }

  if (!validator.equals(password, password_confirm)) {
    throw new AppError('Validation Error: Passwords do not match.', 400);
  }

  // Ensure email is lowercase & trim trailing whitespace
  email = email.toLowerCase().trim();

  // Hash password
  const new_pass = await verify_pass(email, password);
  // If the password has been stored, delete the confirm_password
  if (new_pass) {
    password = new_pass;
    password_confirm = '';
    await col.findOneAndUpdate(
      { email },
      { $set: { password_confirm: undefined } }
    );
  }

  await col.createIndex({ email: 1 }, { unique: true });

  const user = {
    name,
    email,
    password,
    password_confirm,
  };
  return user;
};
```

---

## [Lecture 128](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065290)

### **How Authentication with JWT Works**

[JWT Introduction](https://jwt.io/introduction)

[JWT Debugger](https://jwt.io/#debugger-io)

[jsonwebtoken - NPM](https://www.npmjs.com/package/jsonwebtoken)

[Gitbub repo](https://github.com/auth0/node-jsonwebtoken)

---

## [Lecture 129](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065292)

### **Signing up Users**

Below we use JWT to generate a token and send it to the user.

```TypeScript
const signup = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    const user = await validate_input(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.password_confirm
    );
    const result = await col.insertOne(user);

    const token = jwt.sign({ id: result.insertedId}, config.jwt.secret, {expiresIn: config.jwt.expiry})

    res.status(201).json({
      status: 'success',
      token,
      data: {
        message: result,
        user,
      },
    });
  }
);
```

---

## [Lecture 130](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065292)

### **Logging in Users**

```TypeScript
const sign_token = (id: object) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
  });
};

const check_password = async (
  candidate_password: string,
  user_password: string
) => {
  return bcrypt.compare(candidate_password, user_password);
};

export const login = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');
    const { email, password } = req.body;
    // Check if email & password exist
    if (!email || !password) {
      return next(new AppError('Email & Password is Required.', 400));
    }

    // Check if user exists && password is correct
    const user = await col.findOne({ email });
    const correct = await check_password(password, user?.password);
    // If the above passes, send token to client
    if (!user || !correct) {
      return next(new AppError('Incorrect Email or Password', 401));
    }
    // eslint-disable-next-line no-underscore-dangle
    const token = sign_token(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);
```

---

## [Lecture 131](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065300)

### **Protecting Tour Routes - Part 1**

Create a new middleware function `protect` in `/controllers/auth_controller.ts` that will run in our route
handler before the route that we would like to protect, see an example below:

```TypeScript
router
  .route('/')
  .get(protect, tour_controller.get_all_tours)
  .post(tour_controller.create_tour);
```

---

## [Lecture 132](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065304)

### **Protecting Tour Routes - Part 2**

Below is the middleware that will be called before access it granted to `get_all_tours()`.

- Get the token from the headers with `req.headers.authorization`
- Verify the token with `jwt.verify`
- Check if the user still exists - findOne({_id: id}) where id is the id from the verified token
- Check if the password was changed after the token was issues

If all of the above passes, grant access to the protected route.

```TypeScript
const check_password_changed = async (
  jwt_timestamp: number,
  id: object,
  db: any
) => {
  const user = await db.findOne({ _id: id });
  if (user.password_changed_at) {
    const changed_timestamp =
      new Date(user.password_changed_at).getTime() / 1000;

    // The password has not changed since the token was issued
    return jwt_timestamp < changed_timestamp;
  }
  // Not changed
  return false;
};

export const protect = catch_async(
  async (req: any, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    // Get token from headers & check its existence
    let token: any;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // I don't want to use destructuring here because I need the value at the 2nd index & not the 1st
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in.', 401));
    }

    // Verify the token
    const prom: any = new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        resolve(decoded);
      } catch (err) {
        reject(err);
      }
    });
    const decoded = await prom;

    // Check if user still exists
    const id = new ObjectId(decoded.id);
    const fresh_user = await col.findOne({ _id: id });
    if (!fresh_user) {
      return next(
        new AppError('The user with this token does not exist.', 401)
      );
    }

    // Check if user changed password after the token was issued
    if (await check_password_changed(decoded.iat, id, col)) {
      return next(
        new AppError('This password has been changed. Please login again.', 401)
      );
    }
    // Grant access to protected route
    req.user = fresh_user;
    next();
  }
);
```

---
