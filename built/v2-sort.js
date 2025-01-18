export function sortDataByReleaseDate(data) {
    return data.sort((a, b) => new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf());
}
//# sourceMappingURL=v2-sort.js.map