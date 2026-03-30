import pkg from '#root/package' with { type: 'json' };

function version() {
    return pkg.version;
}

export default version;
export const meta = {
    flag: '-V, --version',
    description: 'Print the current version',
};