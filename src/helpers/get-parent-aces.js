import { helpers } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

export default async function getParentAces (app, docs, select = 'user,creator,*') {
  const svcDocuments = app.service('user-documents');
  const svcPermissions = app.service('user-permissions');
  const typedIds = fp.uniq(fp.flatMap(doc => {
    return fp.map(helpers.typedId, doc.ancestors || []);
  }, docs));

  const getAncestors = (ids) => ids.length > 0?
    helpers.findWithTypedIds(app, ids) : Promise.resolve([]);
  const getAncestorPermissions = (ids) => ids.length > 0?
    svcPermissions.find({
      query: { subject: { $in: ids }, $select: select },
      paginate: false
    }) : Promise.resolve([]);

  const [ancestors, permits] = await Promise.all([
    getAncestors(typedIds),
    getAncestorPermissions(typedIds)
  ]);
  const permissions = fp.propOf('data', permits);
  return fp.reduce((arr, doc) => {
    if (!doc.ancestors) return arr;
    arr[doc.id] = [];
    // acnestor reverse loop to check inheritance
    for (let i = doc.ancestors.length - 1; i >= 0; i--) {
      const ancestor = fp.find(
        fp.propEq('id', helpers.getId(doc.ancestors[i])), ancestors);
      if (!ancestor) break;

      const ancestorAces = fp.filter(
        fp.propEq('subject', helpers.typedId(doc.ancestors[i])), permissions);
      if (ancestorAces.length > 0) {
        // subject change to current doc
        const aces = fp.map(fp.assoc('subject', helpers.typedId(doc)), ancestorAces);
        arr[doc.id] = arr[doc.id].concat(aces);
      }
      // continue to next inherited
      if (!ancestor.inherited) break;
    }
    return arr;
  }, {}, docs);
}