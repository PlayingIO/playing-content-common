const { helpers } = require('mostly-feathers-mongoose');
const feeds = require('playing-feed-common');

const createDocumentActivity = require('../helpers/create-document-activity');

const createDocument = (context) => {
  const document = helpers.getHookData(context);
  const actor = helpers.getCurrentUser(context);
  if (!document || !actor) return;

  const custom = {
    actor: `user:${document.creator}`,
    verb: 'document.create',
    message: 'Create the document',
    title: document.title
  };
  return [
    createDocumentActivity(context, document, custom),
    `user:${actor}`,                     // add to actor's activity log
    `${document.type}:${document.id}`,   // add to document's activity log
    `notification:${document.creator}`   // add to document author's notification stream
  ];
};

const notifiers = {
  'document.create': createDocument
};

module.exports = function documentNotifier (event) {
  return feeds.notify(event, notifiers);
};