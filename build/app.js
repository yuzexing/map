var PORT = 9090;//监听的端口
 
var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');
const help = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};
 
var server = http.createServer(function (request, response) {
    var test = url.parse(request.url);
    var pathname = test.pathname;
    if (pathname === '/') {
      pathname = 'index.html';
    } else if (pathname.startsWith('/')) {
      pathname = '.' + pathname;
    }
    var realPath = pathname;    //这里设置自己的文件名称;
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = help[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType,
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);