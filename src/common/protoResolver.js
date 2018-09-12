const path = require("path");
const protobuf = require("protobufjs");

const PROTO_PATH = path.join(__dirname, "../protobuf/catalog.proto");
let _pkg;

function _init() {
    try {
        _pkg = protobuf.loadSync(PROTO_PATH);
    } catch (err) {
        console.log("failed to load proto files", err);
        process.exit(1);
    }
}

/**
 * searches and returns a type in the loaded proto files
 * @param {string} messageType name of the type to resolve example: "Product", "Catalog"
 */
function resolveType(messageType) {
    const resolved = _pkg.lookupTypeOrEnum(messageType);
    resolved.resolveAll();
    if (resolved.resolved) {
        return resolved;
    }
    return null;
}


/**
 * Serializes plain js objects to Buffer which conforms to protobuf message
 * @param {string} messageType name of the type to resolve example: "Product", "Catalog"
 * @param {object} message js plain object which need to be serialized into protobuf buffers
 */
function encodeMessage(messageType, message) {
    const messageProto = resolveType(messageType);
    const validationErr = messageProto.verify(message);

    if (validationErr) {
        throw new TypeError(validationErr);
    }

    return messageProto.encode(messageProto.create(message)).finish();
}

/**
 * Marshals Buffer to plain js objects
 * @param {string} messageType name of the type to resolve example: "Product", "Catalog"
 * @param {Buffer|Uint8Array} data buffer which needs to be deserialized
 */
function decodeMessage(messageType, data) {
    const messageProto = resolveType(messageType);
    const parsed = messageProto.decode(data);
    const message = messageProto.toObject(parsed);
    return message;
}

_init();

module.exports = {
    resolveType,
    encodeMessage,
    decodeMessage
}