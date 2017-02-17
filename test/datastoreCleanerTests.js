/* global it, describe, beforeEach */

var assert = require('assert');
var DatastoreCleaner = require('../plugins/datastoreCleaner.js');

describe('DatastoreCleaner', function() {

	describe('#clean', function() {

		var datastore = [];
		beforeEach('reset datastore', function() {
			datastore = [];
		});

		it('should remove nothing when item count is smaller than 100', function() {
			datastore.push(1, 2, 3);

			DatastoreCleaner.clean(datastore);
			assert.equal(datastore.length, 3);
		});

		it('should remove the first 50 items when item count is higher than 100', function() {
			for (var i = 0; i <= 100; i++) {
				datastore.push(i);
			}

			DatastoreCleaner.clean(datastore);
			assert.equal(datastore.length, 51);
			assert.equal(datastore[0], 50);
		});
	});
});
