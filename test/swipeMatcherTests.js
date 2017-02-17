/* global it, describe, beforeEach */

var assert = require('assert');
var SwipeMatcher = require('../plugins/swipeMatcher.js');
var Swipe = require('../models/swipe.js');
var Point = require('../models/point.js');
var Share = require('../models/share.js');

describe('SwipeMatcher', function() {

	var swipe1 = new Swipe({'deviceId':'test1', 'timestamp':123, 'startX':0, 'startY': 0, 'endX': 1, 'endY': 0});
	var swipe2 = new Swipe({'deviceId':'test2', 'timestamp':123, 'startX':0, 'startY': 0, 'endX': 1, 'endY': 0});

	describe('#findMatchingSwipe', function() {

		it('should return null when no other swipe is available', function() {
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([], swipe1);
			assert.equal(matchingSwipe, null);
		});

		it('should return null when only itself is available', function() {
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([swipe1], swipe1);
			assert.equal(matchingSwipe, null);
		});

		it('should return null when timestamp variance is more than -1', function() {
			swipe2.timestamp = swipe1.timestamp - 2;
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([swipe1, swipe2], swipe1);
			assert.equal(matchingSwipe, null);
		});

		it('should return null when timestamp variance is more than 1', function() {
			swipe2.timestamp = swipe1.timestamp + 2;
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([swipe1, swipe2], swipe1);
			assert.equal(matchingSwipe, null);
		});

		it('should return matching swipe when timestamp variance is less than -1', function() {
			swipe2.timestamp = swipe1.timestamp - 1;
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([swipe1, swipe2], swipe1);
			assert.equal(matchingSwipe, swipe2);
		});

		it('should return matching swipe when timestamp variance is less than 1', function() {
			swipe2.timestamp = swipe1.timestamp + 1;
			var matchingSwipe = SwipeMatcher.findMatchingSwipe([swipe1, swipe2], swipe1);
			assert.equal(matchingSwipe, swipe2);
		});
	});

	describe('#connectionStateForSwipes', function() {

		it('should return null when swipes are null', function() {
			var connectionState = SwipeMatcher.connectionStateForSwipes(null, null);
			assert.equal(connectionState, null);
		});

		it('should return null when first swipe is null', function() {
			var connectionState = SwipeMatcher.connectionStateForSwipes(null, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return null when second swipe is null', function() {
			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, null);
			assert.equal(connectionState, null);
		});

		it('should return null when swipe is not on screen bounds', function() {
			swipe1.start = new Point(0.5, 0.5); swipe1.end = new Point(0.6, 0.6);
			swipe2.start = new Point(0.5, 0.5); swipe2.end = new Point(0, 0.6);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return null when first both swipe up from screen', function() {
			swipe1.start = new Point(0.6, 1); swipe1.end = new Point(0.5, 0.5);
			swipe2.start = new Point(0.6, 1); swipe2.end = new Point(0.5, 0.5);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return null when first both swipe up to screen', function() {
			swipe1.start = new Point(0.6, 0.5); swipe1.end = new Point(0.5, 0);
			swipe2.start = new Point(0.6, 0.5); swipe2.end = new Point(0.5, 0);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return null when first both swipe left from screen', function() {
			swipe1.start = new Point(0, 0.5); swipe1.end = new Point(0.5, 0.5);
			swipe2.start = new Point(0, 0.5); swipe2.end = new Point(0.5, 0.5);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return null when first both swipe left to screen', function() {
			swipe1.start = new Point(0.5, 0.6); swipe1.end = new Point(0, 0.5);
			swipe2.start = new Point(0.5, 0.6); swipe2.end = new Point(0, 0.5);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, null);
		});

		it('should return connected when first swipes right to screen and second swipes left to screen', function() {
			swipe1.start = new Point(0.5, 0.5); swipe1.end = new Point(1, 0.6);
			swipe2.start = new Point(0.5, 0.5); swipe2.end = new Point(0, 0.6);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, 'connected');
		});

		it('should return connected when first swipes down to screen and second swipes up to screen', function() {
			swipe1.start = new Point(0.5, 0.5); swipe1.end = new Point(0.6, 1);
			swipe2.start = new Point(0.5, 0.5); swipe2.end = new Point(0.6, 0);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, 'connected');
		});

		it('should return disconnected when first swipes right from screen and second swipes left from screen', function() {
			swipe1.start = new Point(0, 0.5); swipe1.end = new Point(0.5, 0.6);
			swipe2.start = new Point(1, 0.5); swipe2.end = new Point(0.5, 0.6);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, 'disconnected');
		});

		it('should return disconnected when first swipes up from screen and second swipes down from screen', function() {
			swipe1.start = new Point(0.6, 1); swipe1.end = new Point(0.5, 0.5);
			swipe2.start = new Point(0.6, 0); swipe2.end = new Point(0.5, 0.5);

			var connectionState = SwipeMatcher.connectionStateForSwipes(swipe1, swipe2);
			assert.equal(connectionState, 'disconnected');
		});
	});

	describe('#findMatchingShare', function() {

		var share = null;
		beforeEach('reset share', function() {
			share = new Share(swipe2, swipe1.deviceId, null);
		});

		it('should return null when shares are empty', function() {
			var matchingShare = SwipeMatcher.findMatchingShare(swipe1, []);
			assert.equal(matchingShare, null);
		});

		it('should return null when no share with matching share partner id is found', function() {
			share.sharePartnerId = '999';

			var matchingShare = SwipeMatcher.findMatchingShare(swipe1, [share]);
			assert.equal(matchingShare, null);
		});

		it('should return share if share partner id matches swipe id and timestamps are valid', function() {
			var matchingShare = SwipeMatcher.findMatchingShare(swipe1, [share]);
			assert.equal(matchingShare, share);
		});

		it('should return null if share partner id matches swipe id and timestamps are not valid', function() {
			share.swipe.timestamp = swipe2.timestamp - 10;

			var matchingShare = SwipeMatcher.findMatchingShare(swipe1, [share]);
			assert.equal(matchingShare, null);
		});
	});
});
