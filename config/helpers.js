let path = require('path');

// Helper functions
let ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
  return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function isExternal(module) {
  let context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}

function isExternalOrTargets(module, targets) {
  let context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1 || targets.find(t => context.indexOf(`${t}/`) !== -1);
}

function checkChunk(module, targets) {
  let context = module.context;

  if (typeof context !== 'string') {
    return false;
  }
  return context.indexOf('node_modules') !== -1 && targets.find(t => context.indexOf(`${t}/`) !== -1);
}

function checkInternalChunk(module, targets) {
  let context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') === -1 && targets.find(t => context.indexOf(`${t}/`) !== -1);
}

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.isExternal = isExternal;
exports.checkChunk = checkChunk;
exports.checkInternalChunk = checkInternalChunk;
exports.isExternalOrTargets = isExternalOrTargets;
