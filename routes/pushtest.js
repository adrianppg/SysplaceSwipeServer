var express = require('express');
var router = express.Router();
var Push = require('../plugins/push.js');

router.get('/', function (req, res) {
	Push.sendNotification(req.query.deviceToken, {}, new function(result) {
		res.send(result);
	});
});

module.exports = router;
