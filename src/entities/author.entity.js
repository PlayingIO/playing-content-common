const Entity = require('mostly-entity');

const AuthorEntity = new Entity('Author');

AuthorEntity.discard('createdAt', 'updatedAt', 'destroyedAt');

module.exports = AuthorEntity.freeze();
