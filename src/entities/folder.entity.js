const Entity = require('mostly-entity');
const fp = require('mostly-func');
const BlobEntity = require('./blob.entity');
const DocTypes = require('../constants/doc-types');

const FolderEntity = new Entity('Folder', {
  file: { using: BlobEntity },
  files: { using: BlobEntity },
});

FolderEntity.expose('metadata', (obj, options) => {
  obj.metadata = obj.metadata || {};
  
  const Types = options.DocTypes || DocTypes;

  if (Types[obj.type]) {
    obj.metadata.facets = Types[obj.type].facets;
    obj.metadata.packages = Types[obj.type].packages;
    if (obj.ordered) {
      obj.metadata.facets = obj.metadata.facets.concat('Orderable');
    }
  }

  return fp.sortKeys(obj.metadata);
});

FolderEntity.discard('_id');

module.exports = FolderEntity.freeze();
