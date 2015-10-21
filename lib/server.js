var fs = require("fs");
var url = require("url");
var http = require("http");

function start(route, port) {
    function onRequest(request, response) {
        var urlObj = url.parse(request.url)
        var pathname = urlObj.pathname;
        if (pathname == "/favicon.ico") return;
        console.log("Request for " + pathname + " received.");

        route(pathname, urlObj, response);
    }

    http.createServer(onRequest).listen(port || 8080);
    console.log("Server has started.");
}

exports.start = start;