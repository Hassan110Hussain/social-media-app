import type { Post, SuggestedProfile } from '@/types/api';

export const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Design Studio',
    handle: '@design.studio',
    avatarUrl: '/avatars/1.png',
    imageUrl: '/placeholders/post-1.jpg',
    liked: false,
    likes: 124,
    comments: 18,
    timeAgo: '2h',
    caption: 'Exploring new layouts for the next big release. What do you think?',
    following: true,
  },
  {
    id: '2',
    author: 'Dev Daily',
    handle: '@dev.daily',
    avatarUrl: '/avatars/2.png',
    imageUrl: '/placeholders/post-2.jpg',
    liked: true,
    likes: 482,
    comments: 74,
    timeAgo: '5h',
    caption: 'Dark mode + glassmorphism is still undefeated.',
    following: false,
  },
  {
    id: '3',
    author: 'Product Mindset',
    handle: '@productmind',
    avatarUrl: '/avatars/3.png',
    imageUrl: '/placeholders/post-3.jpg',
    liked: false,
    likes: 96,
    comments: 11,
    timeAgo: '1d',
    caption: 'Ship fast, iterate faster. What feature are you launching this week?',
    following: true,
  },
];

export const suggestedProfiles: SuggestedProfile[] = [
  {
    id: 's1',
    name: 'UI Journal',
    handle: '@uijournal',
    avatarUrl: '/avatars/4.png',
    isFollowing: false,
    reason: 'Followed by design.studio',
  },
  {
    id: 's2',
    name: 'Frontend Club',
    handle: '@frontend.club',
    avatarUrl: '/avatars/5.png',
    isFollowing: false,
    reason: 'Popular in dev.daily',
  },
  {
    id: 's3',
    name: 'Growth House',
    handle: '@growth.house',
    avatarUrl: '/avatars/6.png',
    isFollowing: true,
    reason: 'Because you follow productmind',
  },
];

