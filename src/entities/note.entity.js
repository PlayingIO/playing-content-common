import Entity from 'mostly-entity';
import fp from 'mostly-func';
import BlobEntity from './blob.entity';
import DocTypes from '../constants/doc-types';

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

export default NoteEntity.freeze();
