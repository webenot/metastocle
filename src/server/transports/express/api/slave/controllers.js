const _ = require('lodash');
const errors = require('../../../../../errors');
const utils = require('../../../../../utils');

/**
 * Get the document addition info
 */
module.exports.getDocumentAdditionInfo = node => {  
  return async (req, res, next) => {
    try {
      const info = req.body.info || {};

      if(!await node.checkCollection(info.collection)) {
        throw new errors.WorkError('"info.collection" field is invalid', 'ERR_METASTOCLE_INVALID_COLLECTION_FIELD');
      }

      const testInfo = Object.assign({}, info);
      testInfo.count = await node.db.getCollectionSize(info.collection);
      
      res.send({ 
        count: testInfo.count,
        existenceInfo: await node.getDocumentExistenceInfo(testInfo),
        isFull: await node.checkDocumentFullness(testInfo),
        isAvailable: await node.checkDocumentAvailability(testInfo)
      });
    }
    catch(err) {
      next(err);
    }    
  }
};

/**
 * Get the documents
 */
module.exports.getDocuments = node => {
  return async (req, res, next) => {
    try {      
      const collection = req.body.collection;
      const isCounting = req.body.isCounting;

      if(!await node.checkCollection(collection)) {
        throw new errors.WorkError('"info.collection" field is invalid', 'ERR_METASTOCLE_INVALID_COLLECTION_FIELD');
      }

      let documents = await node.db.getDocuments(collection);
      const actions = utils.prepareDocumentGettingActions(req.body.actions || {});
      const result = await node.handleDocumentsGettingForSlave(documents, actions);

      if(isCounting) {
        documents = _.pick(result.documents, '$duplicate');
      }
      else {
        documents = await node.db.accessDocuments(collection, result.accessDocuments);
        documents = result.documents.map(d => node.db.removeDocumentSystemFields(d, ['$duplicate']));
      }
      
      res.send({ documents });
    }
    catch(err) {
      next(err);
    }   
  } 
};

/**
 * Update the documents
 */
module.exports.updateDocuments = node => {
  return async (req, res, next) => {
    try {      
      const collection = req.body.collection;
      const document = req.body.document;

      if(!utils.isDocument(document)) {
        throw new errors.WorkError('"document" field is invalid', 'ERR_METASTOCLE_INVALID_DOCUMENT_FIELD');
      }  
      
      if(!await node.checkCollection(collection)) {
        throw new errors.WorkError('"info.collection" field is invalid', 'ERR_METASTOCLE_INVALID_COLLECTION_FIELD');
      }      

      let documents = await node.db.getDocuments(collection);
      const actions = utils.prepareDocumentUpdationActions(req.body.actions || {});      
      const result = await node.handleDocumentsUpdation(documents, document, actions);
      documents = await node.db.updateDocuments(collection, result.documents);      
      res.send({ updated: result.documents.length });
    }
    catch(err) {
      next(err);
    }   
  } 
};

/**
 * Delete the documents
 */
module.exports.deleteDocuments = node => {
  return async (req, res, next) => {
    try {      
      const collection = req.body.collection;

      if(!await node.checkCollection(collection)) {
        throw new errors.WorkError('"info.collection" field is invalid', 'ERR_METASTOCLE_INVALID_COLLECTION_FIELD');
      }      

      const documents = await node.db.getDocuments(collection);
      const actions = utils.prepareDocumentDeletionActions(req.body.actions || {});
      const result = await node.handleDocumentsDeletion(documents, actions);
      await node.db.deleteDocuments(collection, result.documents);
      res.send({ deleted: result.documents.length });
    }
    catch(err) {
      next(err);
    }   
  } 
};