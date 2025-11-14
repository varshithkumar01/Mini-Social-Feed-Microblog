
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likeCount: number;
  likedBy: string[]; // Array of user IDs who liked the post
  comments: Comment[];
}
