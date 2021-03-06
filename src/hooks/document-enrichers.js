const assert = require('assert');
const Promise = require('bluebird');
const { helpers } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');
const makeDebug = require('debug');
const url = require('url');

const DocTypes = require('../constants/doc-types');
const Permissions = require('../constants/permissions');
const getAces = require('../helpers/get-aces');
const getParentAces = require('../helpers/get-parent-aces');

const debug = makeDebug('playing:content-common:hooks:documentEnrichers');

// check whether there is any folder children
function hasFolderishChild (context, docs, options) {
  // only Folderish need to check hasFolderishChild
  const Types = options.entities.DocTypes || DocTypes;
  const folders = fp.reduce((ids, doc) => {
    if (fp.contains('Folderish', Types[doc.type] && Types[doc.type].facets || [])) {
      return ids.concat(doc.id);
    }
    return ids;
  }, [], docs);

  const svcFolders = context.app.service('folders');
  const getParents = folders.length > 0
    ? svcFolders.find({ query: { parent: { $in: folders } } })
    : Promise.resolve([]);

  return getParents.then(results => {
    results = fp.propOf('data', results) || [];
    const childrens = fp.groupBy(child => String(child.parent), results);
    return fp.reduce((acc, doc) => {
      const folderishChildren = fp.filter(child => {
        return fp.contains('Folderish', Types[child.type] && Types[child.type].facets || []);
      }, childrens[doc.id] || []);
      acc[doc.id] = folderishChildren.length > 0;
      return acc;
    }, {}, docs);
  });
}

function getBreadcrumbs (context, docs, options) {
  const svcDocuments = context.app.service('documents');

  let ancestorRready = true; // whether already populated
  const ancestors = fp.reject(fp.isNil, fp.flatMap(doc => {
    return fp.map(parent => {
      ancestorRready &= fp.has('type', parent);
      return fp.has('type', parent)? parent : null;
    }, doc.ancestors || []);
  }, docs));

  const ancestorIds = fp.reject(fp.isNil, fp.flatMap(doc => {
    return fp.map(parent => {
      return fp.has('type', parent)? null : helpers.getId(parent);
    }, doc.ancestors || []);
  }, docs));

  const getAncestors = () => {
    if (ancestorIds.length > 0) {
      // with document creating permission/subtypes in current breadcumb
      return svcDocuments.find({
        query: { _id: { $in: ancestorIds } },
        headers: { 'enrichers-document': 'permissions,subtypes' },
        paginate: false
      });
    } else {
      return Promise.resolve();
    }
  };

  return getAncestors().then(results => {
    results = fp.propOf('data', results) || [];
    const breads = fp.map(
      fp.pick(['id', 'path', 'title', 'metadata']),
      fp.concat(ancestors, results)
    );
    return fp.reduce((acc, doc) => {
      const breadcrumbs = fp.map(parent => {
        return fp.find(fp.propEq('id', helpers.getId(parent)), breads);
      }, doc.ancestors || []);
      acc[doc.id] = breadcrumbs;
      return acc;
    }, {}, docs);
  });
}

function getCollections (context, docs, options) {
  const svcUserCollections = context.app.service('user-collections');
  if (!context.params.user) return Promise.resolve({});

  return svcUserCollections.find({
    query: {
      user: context.params.user.id,
      subject: { $in: fp.map(fp.prop('id'), docs) },
      $select: 'collect,*'
    },
    paginate: false
  }).then(results => {
    results = fp.propOf('data', results) || [];
    const documents = fp.groupBy(fp.prop('id'), results);
    return fp.reduce((acc, doc) => {
      if (documents[doc.id] && documents[doc.id].length > 0) {
        acc[doc.id] = documents[doc.id][0].collect;
      }
      return acc;
    }, {}, docs);
  });
}

function getFavorites (context, docs, options) {
  const svcUserFavorites = context.app.service('user-favorites');
  if (!context.params.user) return Promise.resolve();

  return svcUserFavorites.find({
    query: {
      user: context.params.user.id,
      subject: { $in: fp.map(fp.prop('id'), docs) },
    },
    paginate: false
  }).then((results) => {
    results = fp.propOf('data', results) || [];
    const documents = fp.groupBy(fp.prop('id'), results);
    return fp.reduce((acc, doc) => {
      acc[doc.id] = { isFavorite: documents[doc.id] && documents[doc.id].length > 0 || false };
      return acc;
    }, {}, docs);
  });
}

function getAcls (context, docs, options) {
  const inheritedDocs = fp.filter(fp.propEq('inherited', true), docs);
  return Promise.all([
    getAces(context.app, docs),
    getParentAces(context.app, inheritedDocs)
  ]).then(([localAces, inheritedAces]) => {
    const aces = fp.reduce((acc, doc) => {
      acc[doc.id] = acc[doc.id] || [];
      if (localAces && localAces[doc.id] && localAces[doc.id].length > 0) {
        acc[doc.id].push({ name: 'local', aces: localAces[doc.id] });
      }
      return acc;
    }, {}, docs);
    return fp.reduce((acc, doc) => {
      acc[doc.id] = acc[doc.id] || [];
      if (inheritedAces && inheritedAces[doc.id] && inheritedAces[doc.id].length > 0) {
        acc[doc.id].push({ name: 'inherited', aces: inheritedAces[doc.id] });
      }
      return acc;
    }, aces, docs);
  });
}

function getPermission (context, docs, options) {
  const Types = options.entities.DocTypes || DocTypes;
  return Promise.resolve(fp.reduce((acc, doc) => {
    const subtypes = Types[doc.type] && Types[doc.type].subtypes;
    // TODO: user acls
    let permissions = ['Everything', 'Read', 'Write', 'ReadWrite'];
    if (subtypes) {
      permissions = permissions.concat(['ReadChildren', 'AddChildren', 'RemoveChildren']);
    }
    acc[doc.id] = permissions;
    return acc;
  }, {}, docs));
}

function getUserVisiblePermissions (context, docs, options) {
  return Promise.resolve(fp.reduce((acc, doc) => {
    acc[doc.id] = ['Read', 'ReadWrite', 'Everything'];
    return acc;
  }, {}, docs));
}

function getSubtypes (context, docs, options) {
  const Types = options.entities && options.entities.DocTypes || DocTypes;
  return Promise.resolve(fp.reduce((acc, doc) => {
    const subtypes = Types[doc.type] && Types[doc.type].subtypes;
    acc[doc.id] = subtypes? Object.values(fp.pick(subtypes, Types)) : [];
    return acc;
  }, {}, docs));
}

function getTags (context, docs, options) {
  return Promise.resolve(fp.reduce((acc, doc) => {
    acc[doc.id] = doc.tags || [];
    return acc;
  }, {}, docs));
}

function getThumbnail (context, docs) {
  const baseUrl = 'bower_components/playing-content-elements/images/icons/';
  return Promise.resolve(fp.reduce((acc, doc) => {
    acc[doc.id] = {
      url: url.resolve(baseUrl, doc.type + '.png')
    };
    return acc;
  }, {}, docs));
}

// Add document metadata according to request header
module.exports = function documentEnrichers (options = {}) {
  return async context => {
    assert(context.type === 'after', `documentEnrichers must be used as a 'after' hook.`);

    const documentEnrichers = context.params &&
      (context.params.headers && context.params.headers['enrichers-document']);

      // If no enrichers-document header then skip this hook
    if (!documentEnrichers) {
      debug('Skip documentEnrichers without headers', context.params.query);
      return context;
    }

    const enrichers = fp.map(fp.trim, fp.split(',', documentEnrichers));
    debug('enrichers-document %j', enrichers);

    let documents = helpers.getHookDataAsArray(context);
    let promises = {};

    enrichers.forEach(enricher => {
      switch(enricher) {
        case 'acls':
          promises.acls = getAcls(context, documents, options);
          break;
        case 'breadcrumbs':
          promises.breadcrumbs = getBreadcrumbs(context, documents, options);
          break;
        case 'collections':
          promises.collections = getCollections(context, documents, options);
          break;
        case 'favorites':
          promises.favorites = getFavorites(context, documents, options);
          break;
        case 'hasFolderishChild':
          promises.hasFolderishChild = hasFolderishChild(context, documents, options);
          break;
        case 'permissions':
          promises.permissions = getPermission(context, documents, options);
          break;
        case 'preview':
          promises.preview = Promise.resolve(null);
          break;
        case 'renditions':
          promises.renditions = Promise.resolve(null);
          break;
        case 'subtypes':
          promises.subtypes = getSubtypes(context, documents, options);
          break;
        case 'tags':
          promises.tags = getTags(context, documents, options);
          break;
        case 'thumbnail':
          promises.thumbnail = getThumbnail(context, documents, options);
          break;
        case 'userVisiblePermissions':
          promises.userVisiblePermissions = getUserVisiblePermissions(context, documents, options);
          break;
      }
    });

    return Promise.props(promises).then(results => {
      documents.forEach(doc => {
        doc.metadata = doc.metadata || {};
        for (const enricher of Object.keys(results)) {
          if (results[enricher]) {
            doc.metadata[enricher] = results[enricher][doc.id];
          }
        }
        doc.metadata = fp.sortKeys(doc.metadata);
      });
      return context;
    });
  };
};