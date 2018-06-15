import Entity from 'mostly-entity';

const AuthorEntity = new Entity('Author');

AuthorEntity.discard('createdAt', 'updatedAt', 'destroyedAt');

export default AuthorEntity.asImmutable();
