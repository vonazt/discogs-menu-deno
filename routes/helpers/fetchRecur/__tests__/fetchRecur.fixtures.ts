export const getDiscogsResponse = (
  releaseNumber: number,
  numberOfReleases: number,
) =>
  Promise.resolve(
    new Response(JSON.stringify({
      pagination: {
        urls: { next: `https://mockUrl.com/${releaseNumber}` },
        items: numberOfReleases,
      },
      releases: [{
        date_added: `200${releaseNumber}`,
        basic_information: {
          title: `mock_title_${releaseNumber}`,
          year: Number(`200${releaseNumber}`),
          cover_image: `mock_cover_image_${releaseNumber}`,
          artists: [{ name: `mock_artist_${releaseNumber}` }],
          genres: [`mock_genre_${releaseNumber}`],
        },
      }],
    })),
  );

export const mockInitialUrl = "https://mockUrl.com";

export const noResult = [
  Promise.resolve(
    new Response(JSON.stringify({
      pagination: { urls: { next: "" }, items: 0 },
      releases: [],
    })),
  ),
];
