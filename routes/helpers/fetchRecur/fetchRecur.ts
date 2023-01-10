import { DiscogsResponse, Record } from "../../types/index.ts";

const fetchRecur = async (
  nextPagination: string,
  allRecords: Record[],
): Promise<Record[] | undefined> => {
  const resp = await fetch(
    nextPagination,
  );

  const { pagination: { urls, items }, releases }: DiscogsResponse = await resp
    .json();

  const formattedRecords: Record[] = releases.map((
    {
      date_added,
      basic_information: { title, year, cover_image, artists, genres, styles },
    },
  ): Record => ({
    title,
    dateAdded: date_added,
    coverImage: cover_image,
    year,
    artists: artists.map(({ name }) => name),
    genres: genres.sort((a, b) => a.localeCompare(b)),
    styles: styles.sort((a, b) => a.localeCompare(b)),
  }));

  const records = [...allRecords, ...formattedRecords];

  console.log(`Fetched ${records.length} records`);

  if (items === records.length) {
    return records;
  }

  return fetchRecur(urls.next, records);
};

export default fetchRecur;
