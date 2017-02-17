var findMatchingSwipe = function (gestures, swipe) {
	var gestureCount = gestures.length;
	for (var i = gestureCount-1; i >= 0; i--) {
		var otherSwipe = gestures[i];
		if (swipesMatch(swipe, otherSwipe) == true) {
			return otherSwipe;
		}
	}
	return null;
};

var swipesMatch = function (swipe1, swipe2) {
	if (swipe1 == null || swipe2 == null) return false;
	if (swipe1.deviceId === swipe2.deviceId) return false;
	var variance = swipe1.timestamp - swipe2.timestamp;
	if (-1 <= variance && variance <= 1) {
		return true;
	}
	return false;
};

var connectionStateForSwipes = function (swipe1, swipe2) {
	if (swipe1 == null || swipe2 == null) return null;

	if (swipeToScreenBounds(swipe1) && swipeToScreenBounds(swipe2)) {
		var swipeDirection1 = swipeDirection(swipe1, true);
		var swipeDirection2 = swipeDirection(swipe2, true);
		if (swipeDirection1 != swipeDirection2) return 'connected';
	}
	else if (swipeFromScreenBounds(swipe1) && swipeFromScreenBounds(swipe2)) {
		var direction1 = swipeDirection(swipe1, false);
		var direction2 = swipeDirection(swipe2, false);
		if (direction1 != direction2) return 'disconnected';
	}
	return null;
};

var swipeDirection = function(swipe, toScreen) {
	if (toScreen == true) {
		if (swipe.end.x == 0 || swipe.end.x == 1) {
			return horizontalSwipeDirection(swipe);
		}
		else if (swipe.end.y == 0 || swipe.end.y == 1) {
			return verticalSwipeDirection(swipe);
		}
	}
	else {
		if (swipe.start.x == 0 || swipe.start.x == 1) {
			return horizontalSwipeDirection(swipe);
		}
		else if (swipe.start.y == 0 || swipe.start.y == 1) {
			return verticalSwipeDirection(swipe);
		}
	}
};

var horizontalSwipeDirection = function(swipe) {
	var variance = swipe.end.x - swipe.start.x;
	if (variance > 0) return 'right';
	else return 'left';
};

var verticalSwipeDirection = function(swipe) {
	var variance = swipe.end.y - swipe.start.y;
	if (variance > 0) return 'down';
	else return 'up';
};

var swipeToScreenBounds = function(swipe) {
	return swipe.end.x == 0 || swipe.end.x == 1 || swipe.end.y == 0 || swipe.end.y == 1;
};

var swipeFromScreenBounds = function(swipe) {
	return swipe.start.x == 0 || swipe.start.x == 1 || swipe.start.y == 0 || swipe.start.y == 1;
};

var findMatchingShare = function(swipe, shares) {
	var count = shares.length;
	for (var i = count-1; i >= 0; i--) {
		var share = shares[i];
		if (share.sharePartnerId === swipe.deviceId) {
			if (swipesMatch(swipe, share.swipe) == true) {
				shares.splice(i, 1);
				return share;
			}
		}
	}
	return null;
};

module.exports.findMatchingSwipe = findMatchingSwipe;
module.exports.connectionStateForSwipes = connectionStateForSwipes;
module.exports.findMatchingShare = findMatchingShare;
