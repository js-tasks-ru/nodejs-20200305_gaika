const url = require('url');
const http = require('http');
const path = require('path');
const fileSystem = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    return res.end();
  }

  const filepath = path.join(__dirname, 'files', pathname);

  fileSystem.access(filepath, fileSystem.constants.R_OK, (err) => {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          res.statusCode = 404;
          break;
        default:
          res.statusCode = 500;
      }
      return res.end();
    }

    switch (req.method) {
      case 'GET':
        res.statusCode = 200;
        const readStream = fileSystem.createReadStream(filepath);
        readStream.pipe(res);
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  });
});

module.exports = server;
