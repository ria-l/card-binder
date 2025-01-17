export function getElByIdOrThrow(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`No element ${elementId}`);
    }
    return element;
}
//# sourceMappingURL=v2-utils.js.map