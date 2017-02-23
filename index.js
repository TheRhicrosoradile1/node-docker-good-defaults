// simple node web server that displays hello world
// optimized for Docker image

var express = require('express');
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters

var morgan = require('morgan');

// Constants
const PORT = process.env.PORT || 8080;
// so either set PORT envvar when running node natively (local dev)
// or rely on default which should match Dockerfile EXPOSE

// Appi
var app = express();

app.use(morgan('common'));

app.get('/', function (req, res) {
  res.send('Hello Docker World\n');
});

var server = app.listen(PORT, function () {
  console.log('Webserver is ready');
});


//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
})

// shut down server
function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
		}
		process.exit();
  })
}
//
// need above in docker container to properly exit
//

