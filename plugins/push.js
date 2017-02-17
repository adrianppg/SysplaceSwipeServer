var apn = require('apn');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var options = {
	cert: appDir + '/resources/cert.pem',
	key: appDir + '/resources/key.pem',
	production: false,
};

var apnProvider = new apn.Provider(options);

var sendNotification = function (deviceId, payload, completion) {
	var note = new apn.Notification();
	note.badge = 0;
	note.payload = payload;
	note.topic = 'de.cas.merlin.cmmobile';

	apnProvider.send(note, deviceId).then( function(result) {
		completion(result);
	});
};

module.exports.sendNotification = sendNotification;
