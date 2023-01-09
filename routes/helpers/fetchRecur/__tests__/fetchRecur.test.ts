import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";
import fetchRecur from "../fetchRecur.ts";
import {
  assertSpyCall,
  returnsNext,
  stub,
} from "https://deno.land/std@0.171.0/testing/mock.ts";
import {
  getDiscogsResponse,
  mockInitialUrl,
  noResult,
} from "./fetchRecur.fixtures.ts";

Deno.test("fetchRecur", async (t) => {
  await t.step("it calls fetch with correct args", async () => {
    // Arrange
    const mockFetch = stub(
      window,
      "fetch",
      returnsNext(noResult),
    );

    // Act
    await fetchRecur(mockInitialUrl, []);
    mockFetch.restore();

    // Assert
    assertSpyCall(mockFetch, 0, { args: [mockInitialUrl] });
  });

  await t.step("it fetches next list of releases", async () => {
    // Arrange
    const mockFetch = stub(
      window,
      "fetch",
      returnsNext(
        Array(2).fill(null).map((_, index) => getDiscogsResponse(index, 2)),
      ),
    );

    // Act
    await fetchRecur("https://mockUrl.com", []);
    mockFetch.restore();

    // Assert
    assertSpyCall(mockFetch, 0, { args: ["https://mockUrl.com"] });
    assertSpyCall(mockFetch, 1, { args: ["https://mockUrl.com/0"] });
  });

  await t.step("it returns formatted records", async () => {
    // Arrange
    const mockFetch = stub(
      window,
      "fetch",
      returnsNext(
        Array(2).fill(null).map((_, index) => getDiscogsResponse(index, 2)),
      ),
    );

    // Act
    const result = await fetchRecur("https://mockUrl.com", []);
    mockFetch.restore();

    // Assert
    assertEquals(result, [{
      title: "mock_title_0",
      year: 2000,
      dateAdded: "2000",
      coverImage: "mock_cover_image_0",
      artists: ["mock_artist_0"],
      genres: ["mock_genre_0"],
    }, {
      title: "mock_title_1",
      year: 2001,
      dateAdded: "2001",
      coverImage: "mock_cover_image_1",
      artists: ["mock_artist_1"],
      genres: ["mock_genre_1"],
    }]);
  });
});
