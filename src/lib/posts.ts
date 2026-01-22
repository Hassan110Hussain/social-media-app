import { supabase } from "./supabase";
import type { Post, CreatePostInput, SupabaseUser, SupabaseCountWrapper, SupabasePostRow } from "@/types/api";

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

// Helper function to capitalize first letter of each word
function capitalizeName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function mapSupabasePostToUi(post: SupabasePostRow): Post {
    const user = post.users?.[0];

    // Debug logging to help identify issues
    if (!user) {
      console.warn("Post missing user data:", post.id);
    } else if (!user.username && !user.first_name && !user.last_name) {
      console.warn("Post user data incomplete:", post.id, user);
    }

    const likesCount =
    post.likes?.[0]?.count ?? 0;

  const commentsCount =
    post.comments?.[0]?.count ?? 0;

  // Combine first_name and last_name with proper capitalization
  let displayName: string;
  if (user?.first_name && user?.last_name) {
    const firstName = capitalizeName(user.first_name);
    const lastName = capitalizeName(user.last_name);
    displayName = `${firstName} ${lastName}`;
  } else if (user?.first_name) {
    displayName = capitalizeName(user.first_name);
  } else if (user?.last_name) {
    displayName = capitalizeName(user.last_name);
  } else if (user?.username) {
    displayName = capitalizeName(user.username);
  } else {
    displayName = "User";
  }

  // Ensure username always has @ prefix
  const handle = user?.username ? `@${user.username}` : "@user";

  // Check if current user has liked this post
  const isLiked: boolean = !!(post.user_liked && post.user_liked.length > 0);

  return {
    id: post.id,
    author: displayName,
    handle: handle,
    avatarUrl: user?.avatar_url || "",
    imageUrl: post.image_url ?? "",
    liked: isLiked,
    likes: likesCount,
    comments: commentsCount,
    timeAgo: formatTimeAgo(post.created_at),
    caption: post.content,
    following: false,
    userId: post.user_id || "",
  };
}

export async function getCurrentUser() {
  // First check for an active session (more reliable for client-side)
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message || "Auth session missing!");
  }

  if (!session?.user) {
    throw new Error("Auth session missing!");
  }

  return session.user;
}

async function ensureUserRowExists() {
  const user = await getCurrentUser();

  const usernameFromMeta =
    (user.user_metadata && (user.user_metadata as { username?: string }).username) ||
    (user.email ? user.email.split("@")[0] : undefined);

  // Try to extract first_name and last_name from user_metadata
  const nameFromMeta = (user.user_metadata && (user.user_metadata as { name?: string }).name) || null;
  let firstNameFromMeta: string | null = null;
  let lastNameFromMeta: string | null = null;

  if (nameFromMeta) {
    const nameParts = nameFromMeta.trim().split(/\s+/);
    firstNameFromMeta = nameParts[0] || null;
    lastNameFromMeta = nameParts.slice(1).join(' ') || null;
  }

  const avatarFromMeta =
    (user.user_metadata &&
      (user.user_metadata as { avatar_url?: string; avatarUrl?: string }).avatar_url) ||
    (user.user_metadata &&
      (user.user_metadata as { avatar_url?: string; avatarUrl?: string }).avatarUrl) ||
    null;

  // Ensure user row exists in the users table
  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      username: usernameFromMeta ?? `user_${user.id.slice(0, 8)}`,
      first_name: firstNameFromMeta,
      last_name: lastNameFromMeta,
      avatar_url: avatarFromMeta ?? null,
    },
    { onConflict: "id" }
  );
  
  if (error) {
    throw error instanceof Error ? error : new Error("Failed to provision user profile");
  }
}

export async function uploadPostImage(file: File | Blob): Promise<string> {
  const user = await getCurrentUser();
  await ensureUserRowExists();
  
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

export async function likePost(postId: string) {
  const user = await getCurrentUser();

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // Already liked, do nothing
    return;
  }

  const { error } = await supabase.from("likes").insert({
    post_id: postId,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unlikePost(postId: string) {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function toggleLikePost(postId: string): Promise<boolean> {
  const user = await getCurrentUser();

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // Unlike
    await unlikePost(postId);
    return false;
  } else {
    // Like
    await likePost(postId);
    return true;
  }
}

export async function deletePost(postId: string) {
  const user = await getCurrentUser();

  // First verify the post belongs to the current user
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message || "Post not found");
  }

  if (post.user_id !== user.id) {
    throw new Error("You can only delete your own posts");
  }

  // Delete the post (cascade should handle likes and comments)
  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error(deleteError.message || "Failed to delete post");
  }
}

export async function fetchFeedPosts(): Promise<Post[]> {
  const user = await getCurrentUser();

  // Fetch all posts with user data
  // Try with explicit foreign key relationship first
  let postsData: any[] | null = null;
  let postsError: any = null;

  // First attempt: Try with explicit foreign key name
  const query1 = supabase
    .from("posts")
    .select(
      `
      id,
      content,
      image_url,
      created_at,
      user_id,
      users!posts_user_id_fkey (
        id,
        username,
        first_name,
        last_name,
        avatar_url
      ),
      likes:likes(count),
      comments:comments(count)
    `
    )
    .order("created_at", { ascending: false });

  const result1 = await query1;
  
  // If that works and has user data, use it
  if (!result1.error && result1.data && result1.data.length > 0 && result1.data[0].users?.[0]) {
    postsData = result1.data;
    postsError = null;
  } else {
    // Second attempt: Try without explicit foreign key name
    const query2 = supabase
      .from("posts")
      .select(
        `
        id,
        content,
        image_url,
        created_at,
        user_id,
        users (
          id,
          username,
          first_name,
          last_name,
          avatar_url
        ),
        likes:likes(count),
        comments:comments(count)
      `
      )
      .order("created_at", { ascending: false });

    const result2 = await query2;
    postsData = result2.data;
    postsError = result2.error;
    
    // Log if both attempts failed to get user data
    if (!postsError && postsData && postsData.length > 0 && !postsData[0].users?.[0]) {
      console.warn("Both query attempts failed to fetch user data via join");
    }
  }

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Debug: Log first post to see if user data is present
  if (postsData.length > 0 && !postsData[0].users?.[0]) {
    console.warn("Post missing user data, attempting manual fetch:", postsData[0].id);
    console.log("Sample post structure:", { 
      id: postsData[0].id, 
      user_id: postsData[0].user_id,
      hasUsers: !!postsData[0].users,
      usersLength: postsData[0].users?.length 
    });
    
    // Fallback: If user data is missing, fetch it manually
    const userIds = [...new Set(postsData.map(p => p.user_id).filter(Boolean))];
    console.log("Fetching user data for user IDs:", userIds);
    
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, username, first_name, last_name, avatar_url")
        .in("id", userIds);
      
      if (usersError) {
        console.error("Error fetching users in fallback:", usersError);
      } else {
        console.log("Fetched users data:", usersData);
        
        if (usersData && usersData.length > 0) {
          const usersMap = new Map(usersData.map(u => [u.id, u]));
          postsData.forEach(post => {
            if (!post.users || post.users.length === 0) {
              const userData = usersMap.get(post.user_id);
              if (userData) {
                post.users = [userData];
                console.log(`Attached user data to post ${post.id}:`, userData);
              } else {
                console.warn(`No user data found for user_id: ${post.user_id} in post ${post.id}`);
              }
            }
          });
        } else {
          console.warn("No users data returned from fallback query");
        }
      }
    } else {
      console.warn("No user IDs found in posts to fetch");
    }
  }

  // Fetch all likes by current user
  const { data: userLikes, error: likesError } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id);

  if (likesError) {
    throw new Error(likesError.message);
  }

  // Create a set of post IDs that the user has liked
  const likedPostIds = new Set(userLikes?.map((like) => like.post_id) ?? []);

  // Map posts and mark which ones are liked
  return (postsData as Omit<SupabasePostRow, "user_liked">[]).map((post) => {
    const postWithLiked: SupabasePostRow = {
      ...post,
      user_liked: likedPostIds.has(post.id) ? [{ id: "" }] : null,
    };
    return mapSupabasePostToUi(postWithLiked);
  });
}
