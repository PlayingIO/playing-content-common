import fp from 'mostly-func';

/**
 * Get children documents
 */
const getChildrens = async (app, parents) => {
  const svcDocuments = app.service('documents');
  const children = await svcDocuments.find({
    query: { parent: { $in: parents } },
    paginate: false
  });
  return fp.groupBy(fp.prop('parent'), children);
};

/**
 * Fanout move/copy operation to children documents
 */
export default async function fanoutDocuments (app, documents, operation, target) {
  // get children documents with skip/limit
  const parents = fp.map(fp.prop('id'), documents);
  const childrens = await getChildrens(app, parents);
  if (!fp.isEmpty(childrens)) {
    for (const [parent, children] of Object.entries(childrens)) {
      app.agenda.now('fanout_documents', {
        operation, documents: children, target: target
      });
      // process next batch of children
      await fanoutDocuments(app, children, operation, parent);
    }
  }
}