var Datastore = require('../models/datastore.js');
var Swipe = require('../models/swipe.js');
var Share = require('../models/share.js');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
	var swipe = new Swipe(req.query);
	var share = new Share(swipe, req.query.sharePartnerId, req.body);
	Datastore.shares.push(share);
	res.end();
});

module.exports = router;
