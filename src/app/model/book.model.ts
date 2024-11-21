export interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    rating: number;
    isNew?: boolean;
    isTrending?: boolean;
  }