import fp from 'mostly-func';

export default function isRootFolder (path) {
  return fp.contains(path, ['/', '/workspaces']);
}