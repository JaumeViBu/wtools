import pkg from '#root/package' with { type: 'json' };

/**
 * Return the current version
 * @returns {string}
 */
function version() {
    return pkg.version;
}

export const meta = {
    type: 'flag',
    flag: '-V, --version',
    description: 'Print the current version',
};

export default version;