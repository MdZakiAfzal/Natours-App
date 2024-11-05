const express = require('express');
const tourController = require('./../Controllers/tourController');

const router = express.Router();

//param middleware
//router.param('id', tourController.checkId);

router.route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours) //tourController.aliasTopTour this is a middleware and the process is called chaining a middleware

router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plans/:year').get(tourController.getMonthlyPlans);

router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;