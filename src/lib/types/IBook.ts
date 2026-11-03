export interface IBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  borrowDays: number;
  coverUrl: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  borrowCount?: number;
}
