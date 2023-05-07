export {};
declare global {
  interface Login {
    email: string;
    password: string;
  }

  interface UserInfo {
    id: number;
    name: string;
    password: string;
    email: string;
  }

  interface BookInfo {
    id: number;
    title: string;
    author: string;
    price: string;
    description: string;
    genre: string;
    images: string[];
  }
}
