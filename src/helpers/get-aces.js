const { helpers } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

module.exports = async function getAces (app, docs, select = 'user,creator,*') {
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
};