import { helpers } from 'mostly-feathers-mongoose';

// create a document activity
export default function createDocumentActivity (context, document, custom) {
  const actor = helpers.getId(document.creator);
  return {
    actor: `user:${actor}`,
    object: `${document.type}:${document.id}`,
    foreignId: `${document.type}:${document.id}`,
    time: new Date().toISOString(),
    ...custom
  };
}