const axios = require("axios");
const protoResolver = require("./common/protoResolver");

const CATALOG_ENDPOINT = "http://localhost:7878/catalog";

function addCatalog() {
    const catalog = {
        products: [{
            id: 20,
            name: "Diamond Ring",
            price: 102.4,
            quantity: 2,
            tags: ["jewel"],
            status: 1
        }]
    };

    const catalogProto = protoResolver.resolveType("Catalog");
    const validationErr = catalogProto.verify(catalog);

    if (validationErr) {
        console.log("invalid message, error:", validationErr);
        return;
    }

    const data = catalogProto.encode(catalogProto.create(catalog)).finish();

    return axios.post(CATALOG_ENDPOINT, data, {
            headers: {
                "Content-Type": "application/octet-stream"
            },
            responseType: 'arraybuffer'
        })
        .then(res => {
            const apiResponse = protoResolver.decodeMessage("AddCatalogResponse", res.data);
            console.log(apiResponse);
        })
        .catch(err => {
            console.log(err);
        });
}

function getCatalog() {
    return axios.get(CATALOG_ENDPOINT, {
            responseType: 'arraybuffer'
        })
        .then(res => {
            const apiResponse = protoResolver.decodeMessage("GetCatalogResponse", res.data);
            console.log(apiResponse);
        })
        .catch(err => {
            console.log(err);
        });
}

function _init() {
    addCatalog();
    getCatalog();
}

_init();