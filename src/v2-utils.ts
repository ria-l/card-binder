export function getElByIdOrThrow(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No element ${elementId}`);
  }
  return element;
}
