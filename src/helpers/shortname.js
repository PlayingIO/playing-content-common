import fp from 'mostly-func';
import path from 'path';
import shortid from 'shortid';
import slug from 'limax';

/**
 * Generate a short typed name for a document, using exisiting name
 * or slug by provided title
 */
export default function shortname (type, existing, title) {
  let name = type + '-' + shortid.generate();
  if (existing) {
    name = path.basename(existing); // existing short name
  } else if (title) {
    name = type + '-' + slug(title, { tone: false }); // slug by title
  }
  // if name does not contain and start with doc type, add doc type to name
  if (name.indexOf('-') < 0 && !name.startsWith(type)) {
    name = type + '-' + name;
  }
  return name;
}