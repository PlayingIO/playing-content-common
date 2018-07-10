const fp = require('mostly-func');
const Entity = require('mostly-entity');
const url = require('url');

const BlobEntity = new Entity('Blob');

BlobEntity.expose('url', (obj, options) => {
  let baseUrl = '';
  switch(obj.vender) {
    case 'local':
      baseUrl = fp.path(['local', 'baseUrl'], options.blobs);
      return url.resolve(baseUrl, obj.key);
    case 'minio':
      baseUrl = fp.path(['minio', 'baseUrl'], options.blobs);
      return url.resolve(baseUrl, obj.key);
    default: return obj.url || obj.key;
  }
});

BlobEntity.discard('_id');

module.exports = BlobEntity.freeze();
