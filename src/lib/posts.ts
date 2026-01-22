import { supabase } from "./supabase";
import type { Post } from "@/types/api";

type CreatePostInput = {
  content: string;
  imageUrl?: string | null;
};

type SupabaseUser = {
    id: string;
    username: string;
    avatar_url: string | null;
  };

type SupabaseCountWrapper = {
  count: number | null;
};

type SupabasePostRow = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  users: SupabaseUser[];
  likes?: SupabaseCountWrapper[] | null;
  comments?: SupabaseCountWrapper[] | null;
};

function formatTimeAgo(isoDate: string): string {
  const created = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  return `${years}y`;
}

function mapSupabasePostToUi(post: SupabasePostRow): Post {
    const user = post.users?.[0];

    const likesCount =
    post.likes?.[0]?.count ?? 0;

  const commentsCount =
    post.comments?.[0]?.count ?? 0;

  const username = user?.username ?? "Unknown user";

  return {
    id: post.id,
    author: username,
    handle: `@${username}`,
    avatarUrl: user?.avatar_url ?? "/avatars/default.png",
    imageUrl: post.image_url ?? "",
    liked: false,
    likes: likesCount,
    comments: commentsCount,
    timeAgo: formatTimeAgo(post.created_at),
    caption: post.content,
    following: false,
  };
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

async function ensureUserRowExists() {
  const user = await getCurrentUser();

  const usernameFromMeta =
    (user.user_metadata && (user.user_metadata as { username?: string }).username) ||
    (user.email ? user.email.split("@")[0] : undefined);

  const avatarFromMeta =
    (user.user_metadata &&
      (user.user_metadata as { avatar_url?: string; avatarUrl?: string }).avatar_url) ||
    (user.user_metadata &&
      (user.user_metadata as { avatar_url?: string; avatarUrl?: string }).avatarUrl) ||
    null;

  // Many schemas use a `public.users` (or `profiles`) table that mirrors auth users.
  // The FK error you saw indicates the referenced row doesn't exist yet.
  const candidateTables = ["users", "profiles"];

  let lastError: unknown = null;

  for (const table of candidateTables) {
    const { error } = await supabase.from(table).upsert(
      {
        id: user.id,
        username: usernameFromMeta ?? `user_${user.id.slice(0, 8)}`,
        avatar_url: avatarFromMeta,
      },
      { onConflict: "id" }
    );

    if (!error) return;
    lastError = error;
  }

  throw lastError instanceof Error ? lastError : new Error("Failed to provision user profile");
}

export async function uploadPostImage(file: File | Blob): Promise<string> {
  const user = await getCurrentUser();
  const fileName = `post-${user.id}-${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("Social")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      metadata: {
        owner: user.id,
      },
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("Social").getPublicUrl(fileName);

  if (!data || !data.publicUrl) {
    throw new Error("Failed to get public URL for uploaded image");
  }

  return data.publicUrl;
}

export async function createPost({ content, imageUrl }: CreatePostInput) {
  const user = await getCurrentUser();
  await ensureUserRowExists();

  const insertPayload: { content: string; user_id: string; image_url?: string | null } = {
    content,
    user_id: user.id,
  };

  if (typeof imageUrl !== "undefined") {
    insertPayload.image_url = imageUrl;
  }

  const { error } = await supabase.from("posts").insert(insertPayload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchFeedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      image_url,
      created_at,
      users (
        id,
        username,
        avatar_url
      ),
      likes:likes(count),
      comments:comments(count)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return (data as SupabasePostRow[]).map(mapSupabasePostToUi);
}
