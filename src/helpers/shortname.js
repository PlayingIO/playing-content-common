import path from 'path';
import shortid from 'shortid';

/**
 * Generate a short typed name for a document
 */
export default function shortname (type, existing) {
  let name = type + '-' + shortid.generate();
  if (existing) {
    name = path.basename(existing); // existing short name
  }
  // if name does not contain and start with doc type, add doc type to name
  if (name.indexOf('-') < 0 && !name.startsWith(type)) {
    name = type + '-' + name;
  }
  return name;
}