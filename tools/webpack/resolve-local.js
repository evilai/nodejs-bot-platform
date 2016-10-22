function resolveToProjectLevel(deps) {
    return Array.isArray(deps) ?
        deps.map(require.resolve) :
        require.resolve(deps);
}

module.exports = resolveToProjectLevel;
