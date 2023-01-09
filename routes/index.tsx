import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import fetchRecur from "./helpers/fetchRecur/fetchRecur.ts";
import { Record } from "./types/index.ts";
import { load } from "https://deno.land/std@0.171.0/dotenv/mod.ts";
import dateformat from "dateformat";

export const handler: Handlers = {
  async GET(_, ctx) {
    const configData = await load();
    const discogsToken = configData["DISCOGS_TOKEN"];

    const records = await fetchRecur(
      `https://api.discogs.com//users/vonazt/collection/folders/0/releases?sort=artist&sort_order=asc&token=${discogsToken}`,
      [],
    );

    return ctx.render(records);
  },
};

export default function Home({ data }: PageProps<Record[]>) {
  return (
    (
      <>
        <Head>
          <title>Discogs menu</title>
        </Head>
        <div class="p-4 mx-auto max-w-screen-md">
          <div class="grid grid-cols-3 gap-4">
            {data.map((
              { title, dateAdded, coverImage, year, artists, genres },
            ) => (
              <div class="border-1 my-4">
                <div class="flex justify-center">
                  <img
                    class="w-36 h-36 object-fill"
                    src={coverImage}
                  />
                </div>
                <div class="p-2">
                  <p class="text-xs">
                    <strong>Title:</strong> {title}
                  </p>
                  <p class="text-xs">
                    <strong>Artist:</strong> {artists.join(", ")}
                  </p>

                  <p class="text-xs">
                    <strong>Year of release:</strong> {year}
                  </p>
                  <p class="text-xs">
                    <strong>Genres:</strong> {genres.join(", ")}
                  </p>
                  <p class="text-xs">
                    <strong>Date added:</strong>{" "}
                    {dateformat(dateAdded, "dd/mm/yyyy")}
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
