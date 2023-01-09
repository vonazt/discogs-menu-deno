import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import fetchRecur from "./helpers/fetchRecur/fetchRecur.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const records = await fetchRecur(
      "https://api.discogs.com//users/vonazt/collection/folders/0/releases?sort=artist&sort_order=asc",
      [],
    );

    return ctx.render(records);
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message now in the
          ./routes/index.tsx file, and refresh.
        </p>
      </div>
    </>
  );
}
