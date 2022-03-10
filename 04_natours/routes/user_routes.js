/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 User Router
*/

const express = require('express');
const user_controller = require(`${__dirname}/../controllers/user_controller`);

const router = express.Router();

// ROUTES
router
  .route('/')
  .get(user_controller.get_all_users)
  .post(user_controller.create_user);
router
  .route('/:id')
  .get(user_controller.get_user_by_id)
  .patch(user_controller.update_user)
  .delete(user_controller.delete_user);

module.exports = router;
