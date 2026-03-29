import pkg from '../../package.json' with { type: 'json' };

function version() {
  return pkg.version;
}

export default version;