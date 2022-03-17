/* Author: Liam Lage
	 Date:   10/03/2022

	 Description:
	 Tour Router
*/

const express = require('express');
const tour_controller = require(`${__dirname}/../controllers/tour_controller`);

const router = express.Router();

// router.param('id', tour_controller.check_id);

router
  .route('/top-5-tours')
  .get(tour_controller.alias_top_tours, tour_controller.get_all_tours);

router.route('/tour-stats').get(tour_controller.get_tour_stats);
router.route('/monthly-plan/:year').get(tour_controller.get_monthly_plan);

// Routes
router
  /* We specify v1 so that we can make changes to the API
	   without breaking the production version */
  .route('/')
  .get(tour_controller.get_all_tours)
  .post(tour_controller.create_tour);

router
  /* To create variables in the URL, we use a colon before the var, as in
		 :id above, we can add optional parameters like this :<parameter>? */
  .route('/:id')
  .get(tour_controller.get_tour)
  .patch(tour_controller.update_tour) // On a patch request, the client should only send the properties that have changed
  .delete(tour_controller.delete_tour);

module.exports = router;
