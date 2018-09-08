const express = require("express");
const bodyParser = require("body-parser");

const protoResolver = require("./common/protoResolver");

const catalogs = [];
const PORT = 7878;

/********* Handlers and middlewares ***********/

//creating a middleware which can do the protobuf message parsing would be nice
function parseProto(req, res, next) {
    req.body = protoResolver.decodeMessage("Catalog", req.body);
    next();
}

function getCatalogs(req, res) {
    const apiResponse = protoResolver.encodeMessage("GetCatalogResponse", {
        status: 1,
        catalogs
    });
    
    res.setHeader("Content-Type", "application/octet-stream");
    res.write(apiResponse);
    res.end();
}

function addCatalog(req, res) {
    const product = req.body;
    catalogs.push(product);
    const apiResponse = protoResolver.encodeMessage("AddCatalogResponse", {
        status: 1
    });
    
    res.setHeader("Content-Type", "application/octet-stream");
    res.write(apiResponse);
    res.end();
}

/********************************/

//define the express router, which allows as to segregate logical operations against one endpoint nicely 
const router = express.Router();
router.route("/catalog")
    .get(getCatalogs)
    .post([parseProto, addCatalog]);

//create a express server app
const server = express();

//following is important, we do need raw request body stream, since we are gonna parse it ourselves
server.use(bodyParser.raw());
server.use("/", router);

server.listen(PORT, () => console.log("started listening on port", PORT));
