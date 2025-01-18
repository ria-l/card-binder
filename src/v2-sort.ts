export function sortDataByReleaseDate(
  data: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
  }[]
) {
  return data.sort(
    (a, b) =>
      new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf()
  );
}
