const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");

router.route("/initialize").get(authControllers.initializeDatabase);

router.route("/transactions").get(authControllers.transactions);

router.route("/statistics").get(authControllers.statistics);

router.route("/barChart").get(authControllers.barChart);

router.route("/pieChart").get(authControllers.pieChartData);

router.route("/combined").get(authControllers.combined);


module.exports = router;