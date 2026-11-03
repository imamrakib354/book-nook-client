export interface IBorrow {
  _id: string;
  bookId: string;
  name: string;
  email: string;
  title: string;
  author?: string;
  coverUrl: string;
  borrowDate: string;
  dueDate: string;
}
