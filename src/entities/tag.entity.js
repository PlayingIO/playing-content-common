import Entity from 'mostly-entity';

const TagEntity = new Entity('Tag');

TagEntity.discard('createdAt', 'updatedAt', 'destroyedAt');

export default TagEntity.freeze();
