export type FeedFilter = 'for-you' | 'following' | 'my-feed';

/** Relationship label shown on posts: Authored (you), Following (you follow), Network (2nd degree), Featured (others) */
export type PostSource = 'authored' | 'following' | 'network' | 'featured';

export type Post = {
  id: string;
  author: string;
  handle: string;
  avatarUrl: string;
  /** Primary/first image URL (backward compat) */
  imageUrl: string;
  /** All image URLs (multiple images use this for carousel) */
  imageUrls: string[];
  liked: boolean;
  likes: number;
  comments: number;
  shares: number;
  shared: boolean;
  saved: boolean;
  timeAgo: string;
  caption: string;
  following: boolean;
  /** Label to show: Authored | Following | Network | Featured */
  postSource: PostSource;
  userId: string;
};

export type SuggestedProfile = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isFollowing: boolean;
  reason: string;
};

// Auth types
export type Message = { type: 'success' | 'error'; text: string } | null;

// Dashboard component types
export type Board = {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  items: number;
  collaborators: number;
  updated: string;
  pinned?: boolean;
};

export type ChatMessage = {
  id: string;
  from: "you" | "them";
  text: string;
  time: string;
};

export type Chat = {
  id: string;
  name: string;
  handle: string;
  status: "online" | "offline";
  avatarUrl: string;
  lastActive: string;
  unread: number;
  messages: ChatMessage[];
};

export type ExploreItem = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  coverUrl: string;
  gradient: string;
  likes: number;
  saves: number;
  views: number;
};

// Posts API types
export type CreatePostInput = {
  content: string;
  imageUrl?: string | null;
  /** Multiple image URLs (stored as JSON array in DB when length > 1) */
  imageUrls?: string[];
};

export type SupabaseUser = {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url: string | null;
};

export type SupabaseCountWrapper = {
  count: number | null;
};

export type SupabasePostRow = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id?: string;
  users?: SupabaseUser[];
  likes?: SupabaseCountWrapper[] | null;
  comments?: SupabaseCountWrapper[] | null;
  shares?: SupabaseCountWrapper[] | null;
  user_liked?: { id: string }[] | null;
  user_shared?: { id: string }[] | null;
  user_saved?: { id: string }[] | null;
};

// Comment types – supports threaded replies
export type Comment = {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  users: {
    username: string;
    avatar_url: string | null;
  };
  /** Nested replies (only on top-level comments from fetchComments) */
  replies?: Comment[];
};

// User profile types
export type UserProfile = {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  date_of_birth?: string | null;
  avatar_url: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Notification types
export type NotificationType = 'like' | 'comment' | 'follow' | 'share';

export type NotificationRow = {
  id: string;
  type: "like" | "comment" | "share";
  created_at: string;
  post_id: string | null;
  actor_id: string | null;
  comment_id: string | null;
  is_read: boolean;
};

export type Notification = {
  id: string;
  type: NotificationType;
  userId: string;
  userAvatar: string;
  userName: string;
  userHandle: string;
  postId?: string;
  postImageUrl?: string;
  commentContent?: string;
  timeAgo: string;
  is_read: boolean;
};

