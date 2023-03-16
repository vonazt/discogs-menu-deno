import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import fetchRecur from "./helpers/fetchRecur/fetchRecur.ts";
import { Record } from "./types/index.ts";
import { load } from "https://deno.land/std@0.171.0/dotenv/mod.ts";
import dateformat from "dateformat";

export const handler: Handlers<{ collection: Record[]; appendix: Record[] }> = {
  async GET(_, ctx) {
    const configData = await load();
    const discogsToken = configData["DISCOGS_TOKEN"];

    const allRecords = await fetchRecur(
      `https://api.discogs.com//users/vonazt/collection/folders/0/releases?sort=added&sort_order=desc&token=${discogsToken}`,
      [],
    );

    const records = allRecords!.reduce(
      (records, record) =>
        records.some(({ title }) => title === record.title)
          ? records
          : [...records, record],
      [] as Record[],
    ).sort((a, b) => a.genres[0].localeCompare(b.genres[0])).map((
      record,
    ) => ({
      ...record,
      artists: record.artists.map((artist) =>
        artist.replace(new RegExp(/\(\d+\)/), "")
      ),
    }));

    const appendix = records.filter(({ dateAdded }) =>
      new Date(dateAdded).getTime() > new Date("2023-01-10").getTime()
    );
    const collection = records.filter(({ dateAdded }) =>
      new Date(dateAdded).getTime() < new Date("2023-01-10").getTime()
    );

    return ctx.render({ collection, appendix });
  },
};

export default function Home(
  { data }: PageProps<{ collection: Record[]; appendix: Record[] }>,
) {
  return (
    (
      <>
        <Head>
          <title>Discogs menu</title>
        </Head>
        <div class="p-4 mx-auto max-w-screen-md">
          <div class="grid grid-cols-3 gap-3">
            <h1 class="col-span-3 text-xl text-center">APPENDIX</h1>
            {data.appendix.map((
              { title, dateAdded, coverImage, artists, genres, styles },
            ) => (
              <div class="border-2 my-1 shadow-2xl flex flex-wrap col-span-1 justify-center flex-auto">
                <img
                  class="pt-1 w-32 h-32 object-fill"
                  src={coverImage}
                />
                <div class="p-2 text-center">
                  <p class="text-xs  w-full">
                    <strong>Title:</strong> {title}
                  </p>
                  <p class="text-xs  w-full">
                    <strong>Artist:</strong> {artists.join(", ")}
                  </p>
                  <p class="text-xs  w-full">
                    <strong>Genres:</strong> {genres.join(", ")}
                  </p>
                  <p class="text-xs  w-full">
                    <strong>Styles:</strong>{" "}
                    {styles.length ? styles.join(", ") : genres.join(", ")}
                  </p>
                  <p class="text-xs  w-full">
                    <strong>Date added:</strong>{" "}
                    {dateformat(dateAdded, "dS mmm yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  );
}
