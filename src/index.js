const DocTypes = require('./constants/doc-types');
const Permissions = require('./constants/permissions');
const AuthorEntity = require('./entities/author.entity');
const BatchEntity = require('./entities/batch.entity');
const BlobEntity = require('./entities/blob.entity');
const DocumentEntity = require('./entities/document.entity');
const FileEntity = require('./entities/file.entity');
const FolderEntity = require('./entities/folder.entity');
const NoteEntity = require('./entities/note.entity');
const TagEntity = require('./entities/tag.entity');

const copyDocument = require('./helpers/copy-document');
const createDocumentActivity = require('./helpers/create-document-activity');
const fanoutDocuments = require('./helpers/fanout-documents');
const getAces = require('./helpers/get-aces');
const getParentAces = require('./helpers/get-parent-aces');
const moveDocument = require('./helpers/move-document');
const shortname = require('./helpers/shortname');

const addMetadata = require('./hooks/add-metadata');
const computeAncestors = require('./hooks/compute-ancestors');
const computePath = require('./hooks/compute-path');
const documentEnrichers = require('./hooks/document-enrichers');
const documentNotifier = require('./hooks/document-notifier');
const fetchBlobs = require('./hooks/fetch-blobs');
const isDocumentType = require('./hooks/is-document-type');

const schemas = require('./schemas');

module.exports = {
  DocTypes,
  Permissions,
  AuthorEntity,
  BatchEntity,
  BlobEntity,
  DocumentEntity,
  FileEntity,
  FolderEntity,
  NoteEntity,
  TagEntity,
  copyDocument,
  createDocumentActivity,
  fanoutDocuments,
  getAces,
  getParentAces,
  moveDocument,
  shortname,
  addMetadata,
  computeAncestors,
  computePath,
  documentEnrichers,
  documentNotifier,
  fetchBlobs,
  isDocumentType,
  schemas
};