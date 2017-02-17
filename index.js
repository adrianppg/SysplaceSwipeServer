var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var gesture = require('./routes/gesture');
var share = require('./routes/share');

var push = require('./routes/pushtest');
var datastore = require('./routes/datastore');

app.listen(3000, function () {
	console.log('Listening on port 3000!');
});

app.use(bodyParser.json());

app.use('/gesture', gesture);
app.use('/share', share);

app.use('/pushtest', push);
app.use('/datastore', datastore);


var DatastoreCleaner = require('./plugins/datastoreCleaner');
DatastoreCleaner.setup(1000 * 10);
