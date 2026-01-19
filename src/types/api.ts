export type FeedFilter = 'for-you' | 'following';

export type Post = {
  id: string;
  author: string;
  handle: string;
  avatarUrl: string;
  imageUrl: string;
  liked: boolean;
  likes: number;
  comments: number;
  timeAgo: string;
  caption: string;
  following: boolean;
};

export type SuggestedProfile = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isFollowing: boolean;
  reason: string;
};

