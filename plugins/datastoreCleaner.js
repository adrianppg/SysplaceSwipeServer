var Datastore = require('../models/datastore');

var setup = function(interval) {
	setInterval(function(){
		clean(Datastore.gestures);
		clean(Datastore.shares);
	}, interval);
};

var clean = function(datastore) {
	var count = datastore.length;
	if (count < 100) return;
	datastore.splice(0, 50);
};

module.exports.setup = setup;
module.exports.clean = clean;
