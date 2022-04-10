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

[JWT Gitbub repo](https://github.com/auth0/node-jsonwebtoken)

Additional Resources:

- [What is JWT & Why Should You Use It - Web Dev Simplified](https://youtu.be/7Q17ubqLfaM)
- [JWT Authentication Tutorial - Node.js - Web Dev Simplified](https://youtu.be/mbsmsi7l3r4)

---

## [Lecture 129](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065292)

### **Signing up Users**

Below we use JWT to generate a token and send it to the user using `jwt.sign(payload | privateKey | options)`.

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

Additional Resources:

- [Build Node.js User Authentication - Password Login - Web Dev Simplified](https://youtu.be/Ud5xKCYQTjM)

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
    const current_user = await col.findOne({ _id: id });
    if (!current_user) {
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
    req.user = current_user;
    next();
  }
);
```

---

## [Lecture 133](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065306)

### **Advanced Postman Setup**

Set environment variables for the URL during dev & production, automatically set an environment variable for the JWT token.

---

## [Lecture 134](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065310)

### **Authorization: User Roles & Permissions**

Add middleare to restrict routes to specified user roles.

In `auth_controller.ts`:

```TypeScript
export const restrict = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // roles ['admin', 'lead_guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
```

In `tours.ts`(router) we restrict delete tour route to only admin & lead-guide:

```TypeScript
router
  .route('/:id')
  .get(tour_controller.get_tour)
  .patch(tour_controller.update_tour)
  .delete(protect, restrict('admin', 'lead-guide'), tour_controller.delete_tour);
```

---

## [Lecture 135](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065314)

### **Password Reset Functionality: Resest Tokens**

Create two new POST route for forgot-password in `users.ts`(router):

```JavaScript
router.post('/forgot-password', forgot_password);
```

Create middleware functions for forgot_password in `auth_controller.ts`:

```TypeScript
const create_password_reset_token = async () => {
  // Generate reset token
  const reset_token = randomBytes(32).toString('hex');
  // Hash reset token
  const hash = createHash('sha256').update(reset_token).digest('hex');

  // Token will expire 10 minutes from request
  const timestamp = Date.now() + 10 * 60 * 1000;
  const expiry = new Date(timestamp);

  const token = {
    reset_token,
    hash,
    expiry,
  };
  return token;
};

export const forgot_password = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    // Get user based on posted email
    const user = await col.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError(`There is no user with the email: ${req.body.email}.`, 404)
      );
    }

    // Generate random reset token & insert it into the db
    const token = await create_password_reset_token();
    await col.findOneAndUpdate({email: req.body.email}, {$set: {password_reset_token: token.hash, password_reset_expiry: token.expiry}})

    // Send it to the users email
    next();
  }
);
```

---

## [Lecture 136](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065316)

### **Sending Emails with Nodemailer**

[nodemailer - NPM](https://www.npmjs.com/package/nodemailer)

Create a new function, in a new file - `/utils/email.ts`:

```TypeScript
import nodemailer from 'nodemailer';
import config from '../config/config';

const send_email = async (options: any) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.username,
      pass: config.email.password,
    },
  });

  // Define email options
  const mail_options = {
    from: 'Liam Lage <liam@zyxis.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:,
  };

  // Send the email
  await transporter.sendMail(mail_options);
};

export default send_email;
```

In `/controllers/auth_controller.ts`, we update the `forgot_password` function:

```TypeScript
export const forgot_password = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    // Get user based on POSTed email
    const user = await col.findOne({ email: req.body.email });

    // If can't find the user, throw error
    if (!user) {
      return next(
        new AppError(`There is no user with the email: ${req.body.email}.`, 404)
      );
    }

    // Generate random reset token & insert it into the db
    const token = await create_password_reset_token();

    await col.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          password_reset_token: token.hash,
          password_reset_expiry: token.expiry,
        },
      }
    );

    // Send the token to the users email
    const reset_url = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${token.reset_token}`;

    const message = `Forgot your password?\n\nSubmit a PATCH request with your new password & password_confirm to:\n${reset_url}.\n\nIf you didn't forget your password, ignore this email.\n\nRegards\nAdmin`;
    try {
      await send_email({
        email: user.email,
        subject: 'Password Reset Token (Valid for 10 min)',
        message,
      });
    } catch (err) {
      // If the email fails to send, remove the token & expiry from the db & throw error
      user.password_reset_token = undefined;
      user.password_reset_expiry = undefined;

      await col.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            password_reset_token: undefined,
            password_reset_expiry: undefined,
          },
        }
      );

      return next(
        new AppError(
          `Error sending email to ${user.email}. Try again later.`,
          500
        )
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email.',
    });
  }
);
```

---

## [Lecture 137](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065322)

### **Password Reset Functionality: Setting New Password**

```TypeScript
const validate_password_update = async (
  db: any,
  email: string,
  password: any,
  password_confirm: any
) => {
  // Validate password
  if (typeof password !== 'string' || !password || password === '') {
    throw new AppError('ValidationError: Password is required.', 400);
  }

  if (password.length < 8) {
    throw new AppError(
      'Password does not meet minimum length requirements',
      401
    );
  }

  // Validate password confirmation
  if (
    typeof password_confirm !== 'string' ||
    !password_confirm ||
    password_confirm === ''
  ) {
    throw new AppError(
      'ValidationError: Password confirmation is required.',
      400
    );
  }

  if (!validator.equals(password, password_confirm)) {
    throw new AppError('Validation Error: Passwords do not match.', 400);
  }

  // Ensure email is lowercase & trim trailing whitespace
  email = email.toLowerCase().trim();

  // Hash password
  const new_pass = await encrypt_pass(email, password, db);

  // If the password has been encrypted, delete the confirm_password
  if (new_pass) {
    password = new_pass;
    password_confirm = undefined;
  }

  const user = {
    password,
    password_confirm,
  };
  return user;
};

export const reset_password = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await conn;
    const col = db.collection('users');

    // Get user based on the token
    const hashed_token = createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const now = new Date(Date.now());

    const user = await col.findOne({
      password_reset_token: hashed_token,
      password_reset_expiry: { $gt: now },
    });

    // If token has not expired & user exists - set new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired.', 400));
    }
    user.password = req.body.password;
    user.password_confirm = req.body.password_confirm;

    const validated_user = await validate_password_update(
      col,
      user.email,
      req.body.password,
      req.body.password_confirm
    );

    await col.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          password: validated_user.password,
          password_confirm: validated_user.password_confirm,
          password_reset_token: undefined,
          password_reset_expiry: undefined,
          password_changed_at: new Date(Date.now() - 1000)
        },
      }
    );

    // Log the user in, send JWT
    // eslint-disable-next-line no-underscore-dangle
    const token = sign_token(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
    // next();
  }
);
```

---

## [Lecture 138](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065326)

### **Updating the Current User: Password**

```JavaScript
export const update_password = catch_async(async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const db = await conn;
  const col = db.collection('users');

  // Get user from collection
  // eslint-disable-next-line no-underscore-dangle
  const user = await col.findOne({ id: req._id });

  // Check if POSTed current password is correct
  if (!check_password(req.body.password_current, user?.password)) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  // Validate the new password
  const validated_pass = await validate_password_update(
    col,
    user?.email,
    req.body.password,
    req.body.password_confirm
  );

  // Update the password in the db
  await col.findOneAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: user?._id },
    {
      $set: {
        password: validated_pass.password,
        password_changed_at: new Date(Date.now() - 1000),
      },
    }
  );

  // Log the user in, send JWT
  // eslint-disable-next-line no-underscore-dangle
  const token = sign_token({ id: user?._id });
  res.status(200).json({
    status: 'success',
    token,
  });
});
```

---

## [Lecture 139](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065332)

### **Updating the Current User: Data**

For now, allow the user to only update name & email, reject other fields.

```TypeScript
const validate_update_me = async (obj: user, ...allowed_fields: string[]) => {
  // Update new object with the fields in object that are allowed parameters
  const new_obj: user = {};
  Object.keys(obj).forEach((el: any) => {
    if (allowed_fields.includes(el)) {
      new_obj[el] = obj[el];
    }
  });

  // Validate Name
  if (new_obj.name) {
    if (new_obj.name === '' || typeof new_obj.name !== 'string') {
      throw new AppError('ValidationError: Invalid Name.', 400);
    }
  }

  // Validate email
  if (new_obj.email) {
    if (
      typeof new_obj.email !== 'string' ||
      new_obj.email === '' ||
      !validator.isEmail(new_obj.email)
    ) {
      throw new AppError('ValidationError: Invalid email.', 400);
    }
  }
  return new_obj;
};

export const update_me = catch_async(
  async (req: any, res: Response, next: NextFunction) => {
    const { db } = req.app.locals;
    const col = db.collection('users');
    // Create an error if user POSTs password data
    if (req.body.password || req.body.password_confirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /update-password',
          400
        )
      );
    }

    // Filter out unwanted field names
    const result: user = await validate_update_me(req.body, 'name', 'email');

    // Update user document
    let update;
    // Name & Email updated
    if (result.name && result.email) {
      update = await col.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { _id: req.user._id },
        { $set: { name: result.name, email: result.email } }
      );
    }
    // Only name updated
    if (result.name && !result.email) {
      update = await col.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { _id: req.user._id },
        { $set: { name: result.name } }
      );
    }
    // Only email updated
    if(result.email && ! result.name) {
      update = await col.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { _id: req.user._id },
        { $set: { email: result.email } }
      );
    }

    // Send updated information to client
    let updated_user;
    if (update) {
      updated_user = await col
      // eslint-disable-next-line no-underscore-dangle
        .find({ _id: update.value._id })
        .project({ _id: 1, name: 1, email: 1, role: 1 })
        .toArray();
    }

    res.status(200).json({
      status: 'success',
      user: updated_user,
    });
  }
);

```

---

## [Lecture 140](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065334)

### **Deleting the Current User**

The user is not actually deleted from the db, instead we place a flag `active: false` on their document, then in all find operations we filter by `{ active: {$ne: false} }` to exclude inactive
users from the results.

```TypeScript
export const delete_me = catch_async(async (req: any, res: Response) => {
  const { db } = req.app.locals;
  const col = db.collection('users');

  await col.findOneAndUpdate(
    { _id: req.user._id, active: { $ne: false } },
    { $set: { active: false } }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
```

---

## [Lecture 141](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065338)

### **Security Best Practices**

- Compromised Database

  - Strongly encrypt passwords with salt & hash (`bcrypt`)
  - Strongly encrypt password reset tokens (`crypto` with SHA 256)

- Brute Force Attacks

  - Use `bcrypt` (to make login requests slow)
  - Implement rate limiting(`express-rate-limit`)
  - Implement maximum login attempts

- Cross Site Scripting (XXS) Attacks

  - Store JWT in HTTPOnly cookies
  - Sanitize user input data
  - Set special HTTP headers (`helmet` package)

- Denial Of Service (DOS) Attacks

  - Implement rate limiting (`express-rate-limit`)
  - Limit body payload (in `body-parser`)
  - Avoid regular expressions that take an exponentially increasing time to run for non-matching inputs

- NOSQL Query Injection

  - Sanitize user input data
  - Use well defined data-types

- Miscellaneous
  - Always use HTTPS
  - Generate random password reset tokens with expiry dates
  - Deny access to JWT after password change
  - Don't commit sensitive data to Git
  - Don't send error details to clients
  - Prevent Cross-Site Forgery (`csurf` package)
  - Require re-authentication before high-value action
  - Implement a backlist of untrusted JWT
  - Confirm user email address after first creating account
  - Keep user logged in with refresh tokens
  - Implement two-factor authentication
  - Prevent parameter pollution causing Uncaught Exceptions

---

## [Lecture 142](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065340)

### **Sending JWT via Cookie**

```TypeScript
const create_and_send_token = (
  user: user_model,
  status_code: number,
  res: Response
) => {
  const token = sign_token(user._id);

  // Remove sensitive data from the response
  const user_mirror = { ...user };
  user_mirror.password = undefined;
  user_mirror.password_confirm = undefined;
  user_mirror.password_changed_on = undefined;
  user_mirror.active = undefined;
  user_mirror.password_reset_expiry = undefined;
  user_mirror.password_reset_token = undefined;

  const cookie_options = {
    expires: new Date(
      Date.now() + config.jwt.cookie_expiry * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV === 'production') cookie_options.secure = true;
  res.cookie('jwt', token, cookie_options);

  res.status(status_code).json({
    status: 'success',
    token,
    data: {
      user: user_mirror,
    },
  });
};
```

---

## [Lecture 143](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065344)

### **Implementing Rate Limiting**

Limit the number of requests from the same IP to 100 requests per hour.

[express-rate-limit](https://github.com/nfriedly/express-rate-limit)

```Bash
~$ npm i express-rate-limit
```

In `app.ts`:

```TypeScript
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later.',
});
app.use('/api', limiter);
```

---

## [Lecture 144](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065346)

### **Setting Security HTTP Headers**

It is important to use `helmet` at the top of the middleware stack to ensure that the security headers are set.

[helmet](https://github.com/helmetjs/helmet)

```Bash
~$ npm i helmet
```

In `app.ts`:

```TypeScript
import { helmet } from 'helmet';

// Set security HTTP Headers
app.use(helmet());
```

---

## [Lecture 145](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065350)

### **Data Sanitization**

An example of a NoSQL attack:

In the body of the `Login` request we attempt to login with only the password, without providing an email address, instead replacing it with a Mongo query:

```JSON
{
    "email": { "$gt": "" },
    "password": "mynewpass1234"
}
```

Response:

```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE3ZTIzOGEzZDY1NTlmMzgxYmZjNyIsImlhdCI6MTY0ODQ1OTMxNCwiZXhwIjoxNjQ4NDk1MzE0fQ.nxtYjkctQQEPyO8lApXsxP_HjZGwq0rplkJyX-_Mc8w",
    "data": {
        "user": {
            "_id": "62417e238a3d6559f381bfc7",
            "name": "jonas",
            "email": "admin@jonas.io",
            "role": "admin"
        }
    }
}
```

The above works because `"email": { "$gt": "" }` will always be true, all users match the query `{ "$gt": "" }`, thus all the users
will be selected and the login will be successful on the first user that matches the given password.

To protect our API against this, use [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize):

```Bash
~$ npm i express-mongo-sanitize
```

In `app.ts`:

```TypeScript
import mongo_sanitize from 'express-mongo-sanitize';

// This will remove all Mongo operators from the query
app.use(mongo_sanitize());
```

Another possible attack is through Cross Site Scripting, use [xss-clean](https://github.com/jsonmaur/xss-clean) to protect the API from this.

```Bash
npm i xss-clean
```

In `app.ts`:

```TypeScript
import xss from 'xss-clean';

// Data sanitization against XSS
app.use(xss());
```

An attempt to input HTML in the body of `Sign-up`:

```JSON
{
    "name": "<div id='bad-code'>Name</div>",
    "email": "test4@jonas.io",
    "role": "admin",
    "password": "mynewpass1234",
    "password_confirm": "mynewpass1234"
}
```

Response:

```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE4MzUyZDA3YWMzYmY0YjYyMWU3NSIsImlhdCI6MTY0ODQ2MDYyNiwiZXhwIjoxNjQ4NDk2NjI2fQ.5oyJh6kk9STcmsTAkQrwPA2rJwcempOhyQipCoeX4X8",
    "data": {
        "user": {
            "_id": "62418352d07ac3bf4b621e75",
            "name": "&lt;div id='bad-code'>Name&lt;/div>",
            "email": "test4@jonas.io",
            "role": "admin"
        }
    }
}
```

---

## [Lecture 146](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065354)

### **Preventing Parameter Pollution**

An example of inducing this error:

In the 'GET all tours' route, if we try to sort by duration & price with the following query:

`{{URL_LINUX}}/api/v1/tours?sort=duration&sort=price`

This will result in the error:

```JSON
{
    "status": "error",
    "error": {
        "statusCode": 500,
        "status": "error"
    },
    "message": "params.split is not a function",
    "stack": "TypeError: params.split is not a function\n    at get_sort_params (/home/liam/src/Node/natours_update/dist/utils/api.js:7:25)\n    at API_features.sort (/home/liam/src/Node/natours_update/dist/utils/api.js:70:27)\n    at /home/liam/src/Node/natours_update/dist/controllers/tour_controller.js:88:10\n    at /home/liam/src/Node/natours_update/dist/utils/catch_async.js:5:9\n    at Layer.handle [as handle_request] (/home/liam/src/Node/natours_update/node_modules/express/lib/router/layer.js:95:5)\n    at next (/home/liam/src/Node/natours_update/node_modules/express/lib/router/route.js:137:13)\n    at /home/liam/src/Node/natours_update/dist/controllers/auth_controller.js:201:5\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)"
}
```

Use [hpp](https://github.com/analog-nico/hpp) (HTTP Parameter Pollution) to remove the duplicate fields that cause this error.

```Bash
~$ npm i hpp
```

---
