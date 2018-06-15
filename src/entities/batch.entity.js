import Entity from 'mostly-entity';
import BlobEntity from './blob.entity';

const BatchEntity = new Entity('Batch', {
  blobs: { using: BlobEntity }
});

BatchEntity.discard('_id');

export default BatchEntity.asImmutable();
