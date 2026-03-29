import pkg from '../../package.json' with { type: 'json' };

function version() {
  return pkg.version;
}

export default version;
export const meta = {
  flag: '-V, --version',
  description: 'Print the current version',
};