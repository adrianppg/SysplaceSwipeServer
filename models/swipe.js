var Point = require('./point.js');

var Swipe = function(data) {
	this.deviceId = data.deviceId;
	this.timestamp = data.timestamp;
	this.start = new Point(data.startX, data.startY);
	this.end = new Point(data.endX, data.endY);
};

Swipe.prototype.deviceId;
Swipe.prototype.timestamp;
Swipe.prototype.start;
Swipe.prototype.end;

module.exports = Swipe;
