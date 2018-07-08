import DocTypes from './constants/doc-types';
import Permissions from './constants/permissions';
import AuthorEntity from './entities/author.entity';
import BatchEntity from './entities/batch.entity';
import BlobEntity from './entities/blob.entity';
import DocumentEntity from './entities/document.entity';
import FileEntity from './entities/file.entity';
import FolderEntity from './entities/folder.entity';
import NoteEntity from './entities/note.entity';
import TagEntity from './entities/tag.entity';

import copyDocument from './helpers/copy-document';
import createDocumentActivity from './helpers/create-document-activity';
import fanoutDocuments from './helpers/fanout-documents';
import getAces from './helpers/get-aces';
import getParentAces from './helpers/get-parent-aces';
import moveDocument from './helpers/move-document';
import shortname from './helpers/shortname';

import addMetadata from './hooks/add-metadata';
import computeAncestors from './hooks/compute-ancestors';
import computePath from './hooks/compute-path';
import documentEnrichers from './hooks/document-enrichers';
import documentNotifier from './hooks/document-notifier';
import fetchBlobs from './hooks/fetch-blobs';
import isDocumentType from './hooks/is-document-type';

import schemas from './schemas';

export default {
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