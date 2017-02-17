var Swipe = require('../models/swipe.js');
var Datastore = require('../models/datastore.js');
var SwipeMatcher = require('../plugins/swipeMatcher.js');
var Push = require('../plugins/push.js');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	var swipe = new Swipe(req.query);
	Datastore.gestures.push(swipe);

	var share = SwipeMatcher.findMatchingShare(swipe, Datastore.shares);
	if (share != null) {
		res.send('matching share found');
		Push.sendNotification(share.sharePartnerId, {'swipe':swipe, 'configuration':share.config}, null);
		return;
	}

	var matchingSwipe = SwipeMatcher.findMatchingSwipe(Datastore.gestures, swipe);
	if (matchingSwipe == null) {
		res.send('no matching swipe');
		return;
	}

	var connectionState = SwipeMatcher.connectionStateForSwipes(swipe, matchingSwipe);
	if (connectionState == null) {
		res.send('no connection state');
		return;
	}

	Push.sendNotification(swipe.deviceId, {'state':connectionState, 'sharePartnerId':matchingSwipe.deviceId}, null);
	Push.sendNotification(matchingSwipe.deviceId, {'state':connectionState, 'sharePartnerId':swipe.deviceId}, null);
	res.send(connectionState);
});

module.exports = router;
