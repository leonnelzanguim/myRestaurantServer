const assert = require('assert');
//const { call } = require('./app');

exports.insertDocument = (db, document, collection, callback) =>{
    const coll = db.collection(collection);
    return coll.insert(document);
};

exports.findDocuments = (db, collection, callback)=>{
    const coll = db.collection(collection);
    return coll.find({}).toArray()
};

exports.removeDocuments = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    return coll.deleteOne(document)
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, {$set: update}, null)
};