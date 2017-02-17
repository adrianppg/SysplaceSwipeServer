var Datastore = require('../models/datastore.js');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send(Datastore);
});

module.exports = router;
