import { helpers } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

export default async function getAces (app, docs, select = 'user,creator,*') {
  const svcPermissions = app.service('user-permissions');
  const typedIds = fp.map(helpers.typedId, docs);
  const results = await svcPermissions.find({
    query: {
      subject: { $in: typedIds },
      $select: select
    }
  });
  return fp.groupBy(permit => {
    return helpers.getId(permit.subject);
  }, fp.propOf('data', results));
}