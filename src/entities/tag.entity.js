const Entity = require('mostly-entity');

const TagEntity = new Entity('Tag');

TagEntity.discard('createdAt', 'updatedAt', 'destroyedAt');

module.exports = TagEntity.freeze();
