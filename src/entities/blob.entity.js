import fp from 'mostly-func';
import Entity from 'mostly-entity';
import url from 'url';

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

export default BlobEntity.freeze();
