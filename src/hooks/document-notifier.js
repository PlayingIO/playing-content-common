import { helpers } from 'mostly-feathers-mongoose';
import feeds from 'playing-feed-common';

import createDocumentActivity from '../helpers/create-document-activity';

const createDocument = (context) => {
  const document = helpers.getHookData(context);
  if (!document) return;
  const actor = context.params.user.id;
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

export default function documentNotifier (event) {
  return feeds.notify(event, notifiers);
}

