/**
 * Add the document
 */
module.exports.addDocument = node => {
  return async (req, res, next) => {
    try {
      const collection = req.body.collection;
      let document = req.body.document;
      await node.collectionTest(collection); 
      document = await node.addDocument(collection, document, node.prepareClientMessageOptions(req.body));
      res.send({ document });
    }
    catch(err) {
      next(err);
    }
  }
};

/**
 * Update the document
 */
module.exports.updateDocuments = node => {
  return async (req, res, next) => {
    try {
      const collection = req.body.collection;
      const document = req.body.document;
      const actions = req.body.actions || {};
      await node.collectionTest(collection); 
      const result = await node.updateDocuments(collection, document, node.prepareClientMessageOptions(req.body, actions));
      res.send(result);
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
      const actions = req.body.actions || {};
      await node.collectionTest(collection);
      const result = await node.deleteDocuments(collection, node.prepareClientMessageOptions(req.body, actions));
      res.send(result);
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
      const actions = req.body.actions || {};
      await node.collectionTest(collection); 
      const result = await node.getDocuments(collection, node.prepareClientMessageOptions(req.body, actions));
      res.send(result);
    }
    catch(err) {
      next(err);
    }
  }
};

/**
 * Get the documents count
 */
module.exports.getDocumentsCount = node => {
  return async (req, res, next) => {
    try {
      const collection = req.body.collection;
      const actions = req.body.actions || {};
      await node.collectionTest(collection); 
      const count = await node.getDocumentsCount(collection, node.prepareClientMessageOptions(req.body, actions));
      res.send({ count });
    }
    catch(err) {
      next(err);
    }
  }
};

/**
 * Get the document by pk
 */
module.exports.getDocumentByPk = node => {
  return async (req, res, next) => {
    try {
      const collection = req.body.collection;
      const pkValue = req.body.pkValue;
      await node.collectionTest(collection); 
      const document = await node.getDocumentByPk(collection, pkValue, node.prepareClientMessageOptions(req.body));
      res.send({ document });
    }
    catch(err) {
      next(err);
    }
  }
};
