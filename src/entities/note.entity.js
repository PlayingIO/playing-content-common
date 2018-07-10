const Entity = require('mostly-entity');
const fp = require('mostly-func');
const BlobEntity = require('./blob.entity');
const DocTypes = require('../constants/doc-types');

const NoteEntity = new Entity('Note', {
  file: { using: BlobEntity },
  files: { using: BlobEntity },
});

NoteEntity.expose('metadata', (obj, options) => {
  obj.metadata = obj.metadata || {};
  
  const Types = options.DocTypes || DocTypes;

  if (Types[obj.type]) {
    obj.metadata.facets = Types[obj.type].facets;
    obj.metadata.packages = Types[obj.type].packages;
  }

  return fp.sortKeys(obj.metadata);
});

NoteEntity.discard('_id');

module.exports = NoteEntity.freeze();
