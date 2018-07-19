const Entity = require('mostly-entity');
const fp = require('mostly-func');
const BlobEntity = require('./blob.entity');
const DocTypes = require('../constants/doc-types');

const FileEntity = new Entity('File', {
  file: { using: BlobEntity },
  files: { using: BlobEntity },
});

FileEntity.expose('metadata', (obj, options) => {
  obj.metadata = obj.metadata || {};

  const Types = options.DocTypes || DocTypes;

  if (Types[obj.type]) {
    obj.metadata.facets = Types[obj.type].facets;
    obj.metadata.packages = Types[obj.type].packages;
  }

  return fp.sortKeys(obj.metadata);
});

FileEntity.discard('_id');

module.exports = FileEntity.freeze();
