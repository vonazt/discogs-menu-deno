export interface Release {
  date_added: string;
  basic_information: {
    title: string;
    year: number;
    cover_image: string;
    artists: {
      name: string;
    }[];
    genres: string[];
    styles: string[];
  };
}

export interface DiscogsResponse {
  pagination: {
    urls: { next: string };
    items: number;
  };
  releases: Release[];
}

export interface Record {
  title: string;
  dateAdded: string;
  coverImage: string;
  year: number;
  artists: string[];
  genres: string[];
  styles: string[];
}
