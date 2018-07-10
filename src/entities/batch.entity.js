const Entity = require('mostly-entity');
const BlobEntity = require('./blob.entity');

const BatchEntity = new Entity('Batch', {
  blobs: { using: BlobEntity }
});

BatchEntity.discard('_id');

module.exports = BatchEntity.freeze();
