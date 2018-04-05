'use strict'
const Logging = require('@google-cloud/logging');

module.exports = function (RED) {

  function NodeQuery (config) {
    RED.nodes.createNode(this, config)
    var node = this
    this.on('input', function (msg) {

    node.status({fill:"green",shape:"ring",text:"query"});

    const options = {
      autoPaginate: false,
      filter: msg.query || config.query,
      pageSize: msg.pageSize || config.pageSize,
      orderBy: msg.orderBy || config.orderBy
    };

    getLogging(config.secretClientPath)
     .getEntries(options)
     .then(results => {
       msg.payload = results[0]
       node.send(msg)
       node.status({});
     })
     .catch(err => {
       node.error(err)
       node.status({});
     });
    })
  }

  let loggingMap = {}

  function getLogging(keyFilename) {
    if (!loggingMap[keyFilename]) {
      loggingMap[keyFilename] = new Logging({
        keyFilename
      });
    }
    return loggingMap[keyFilename]
  }

  RED.nodes.registerType('gcloud-logging-query', NodeQuery)
}
