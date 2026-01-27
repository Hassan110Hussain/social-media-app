import { supabase } from "@/lib/supabase";
import type { Post, SupabaseUser, SupabasePostRow } from "@/types/api";
import { getCurrentUser } from "@/data/dataForPosts/currentUser";
import { getFollowingIds, getSecondLevelFollowingIds } from "@/lib/follows";
import { getPostSource, hasPostAuthorData, mapSupabasePostToUi } from "@/data/dataForPosts/utils";
// Re-export all functions from dataForPosts for backward compatibility
export { getCurrentUser, ensureUserRowExists } from "@/data/dataForPosts/currentUser";
export { hasPostAuthorData, mapSupabasePostToUi } from "@/data/dataForPosts/utils";
export { uploadPostImage, createPost } from "@/data/dataForPosts/create";
export { deletePost } from "@/data/dataForPosts/delete";
export { updatePost } from "@/data/dataForPosts/update";
export type { UpdatePostInput } from "@/data/dataForPosts/update";

// Re-export like functions for backward compatibility
export { likePost, unlikePost, toggleLikePost } from "@/data/dataForPosts/likes";

// Re-export share functions for backward compatibility
export { sharePost, unsharePost, toggleSharePost } from "@/data/dataForPosts/shares";

// Re-export comment functions for backward compatibility
export { createComment, fetchComments, deleteComment } from "@/data/dataForPosts/comments";

// Re-export save functions for backward compatibility
export { savePost, unsavePost, toggleSavePost, fetchSavedPosts } from "@/data/dataForPosts/saves";

/**
 * Helper function to fetch user data fallback if join fails
 */
async function fetchUserDataFallback(userIds: string[]): Promise<Map<string, SupabaseUser>> {
  if (userIds.length === 0) return new Map();

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, username, first_name, last_name, avatar_url")
    .in("id", userIds);

  if (usersError || !usersData || usersData.length === 0) {
    return new Map();
  }

  return new Map(usersData.map((u) => [u.id, u]));
}

/**
 * Helper function to apply user data fallback to posts
 */
function applyUserDataFallback(
  postsData: any[],
  usersMap: Map<string, SupabaseUser>
): void {
  postsData.forEach((post) => {
    if (!hasPostAuthorData(post as { users?: unknown; user_id?: string })) {
      const userData = usersMap.get(post.user_id);
      if (userData) (post as { users?: SupabaseUser[] }).users = [userData];
    }
  });
}

/**
 * Helper function to fetch user interactions (likes, shares, saved)
 */
async function fetchUserInteractions(userId: string) {
  const [likesResult, sharesResult, savedResult] = await Promise.all([
    supabase.from("likes").select("post_id").eq("user_id", userId),
    supabase.from("shares").select("post_id").eq("user_id", userId),
    supabase.from("saved_posts").select("post_id").eq("user_id", userId),
  ]);

  if (likesResult.error) throw new Error(likesResult.error.message);
  if (sharesResult.error) throw new Error(sharesResult.error.message);
  if (savedResult.error) throw new Error(savedResult.error.message);

  return {
    likedPostIds: new Set(likesResult.data?.map((like) => like.post_id) ?? []),
    sharedPostIds: new Set(sharesResult.data?.map((share) => share.post_id) ?? []),
    savedPostIds: new Set(savedResult.data?.map((saved) => saved.post_id) ?? []),
  };
}

/**
 * Helper function to map posts with user interactions and post source label
 */
function mapPostsWithInteractions(
  postsData: Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
  likedPostIds: Set<string>,
  sharedPostIds: Set<string>,
  savedPostIds: Set<string>,
  currentUserId: string,
  directFollowingIds: Set<string>,
  secondLevelFollowingIds: Set<string>
): Post[] {
  return postsData.map((post) => {
    const postWithLikedAndShared: SupabasePostRow = {
      ...post,
      user_liked: likedPostIds.has(post.id) ? [{ id: "" }] : null,
      user_shared: sharedPostIds.has(post.id) ? [{ id: "" }] : null,
      user_saved: savedPostIds.has(post.id) ? [{ id: "" }] : null,
    };
    const postUserId = post.user_id ?? "";
    const postSource = getPostSource(
      currentUserId,
      postUserId,
      directFollowingIds,
      secondLevelFollowingIds
    );
    return mapSupabasePostToUi(postWithLikedAndShared, postSource);
  });
}

/**
 * Seeded RNG (mulberry32) for deterministic shuffle. When seed is provided, shuffle order is stable across calls.
 */
function seededRandom(seed: number) {
  return function next(): number {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle. Pass an optional seed so the order is deterministic (same seed → same order).
 * Use when you need stable order across multiple fetches in the same session (e.g. avoids Strict Mode flicker).
 */
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const rand = seed !== undefined ? seededRandom(seed) : () => Math.random();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
      comments:comments(count),
      shares:shares(count)
    `
    )
    .order("created_at", { ascending: false });

  const result1 = await query1;
  const firstHasUser = result1.data?.[0] && hasPostAuthorData(result1.data[0] as { users?: unknown; user_id?: string });

  if (!result1.error && result1.data && result1.data.length > 0 && firstHasUser) {
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
        comments:comments(count),
        shares:shares(count)
      `
      )
      .order("created_at", { ascending: false });

    const result2 = await query2;
    postsData = result2.data;
    postsError = result2.error;

    const firstHasUser2 = postsData?.[0] && hasPostAuthorData(postsData[0] as { users?: unknown; user_id?: string });
    if (!postsError && postsData && postsData.length > 0 && !firstHasUser2) {
      console.warn("Both query attempts failed to fetch user data via join");
    }
  }

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Apply fallback for user data if needed
  const needsFallback = postsData.length > 0 && postsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const userIds = [...new Set(postsData.map((p) => p.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const usersMap = await fetchUserDataFallback(userIds);
      applyUserDataFallback(postsData, usersMap);
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  // Get direct and 2nd-level following for post source labels
  let directFollowingIds: Set<string> = new Set();
  let secondLevelFollowingIds: Set<string> = new Set();
  try {
    const following = await getFollowingIds();
    directFollowingIds = new Set(following);
    secondLevelFollowingIds = new Set(await getSecondLevelFollowingIds(following));
  } catch (error) {
    console.warn("Failed to fetch following IDs:", error);
  }

  // Map posts and mark which ones are liked, shared, saved, and source label
  return mapPostsWithInteractions(
    postsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    directFollowingIds,
    secondLevelFollowingIds
  );
}

/**
 * Fetch posts for "For You" tab
 * Returns: Posts from users you follow + posts from users that those users follow (2nd level)
 * Excludes: Current user's own posts
 */
export async function fetchForYouPosts(limit?: number, offset?: number): Promise<Post[]> {
  const user = await getCurrentUser();

  // Get list of users the current user is following (direct follows)
  const directFollowingIds = await getFollowingIds();

  // Get 2nd level follows (people that your follows follow)
  const secondLevelFollowingIds = await getSecondLevelFollowingIds(directFollowingIds);

  // Combine: direct follows + 2nd level follows (exclude current user's own posts)
  const userIdsToShow = [...new Set([...directFollowingIds, ...secondLevelFollowingIds])];

  // If no users to show, return empty array
  if (userIdsToShow.length === 0) {
    return [];
  }

  // Fetch posts from these users
  let postsData: any[] | null = null;
  let postsError: any = null;

  let query = supabase
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
      comments:comments(count),
      shares:shares(count)
    `,
      { count: "exact" }
    )
    .in("user_id", userIdsToShow)
    .order("created_at", { ascending: false });

  // Apply pagination if provided
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  if (offset !== undefined) {
    query = query.range(offset, offset + (limit ?? 10) - 1);
  }

  const result = await query;
  postsData = result.data;
  postsError = result.error;

  if (postsError) {
    console.error("Error fetching For You posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Apply fallback for user data if needed
  const needsFallback = postsData.length > 0 && postsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const userIds = [...new Set(postsData.map((p) => p.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const usersMap = await fetchUserDataFallback(userIds);
      applyUserDataFallback(postsData, usersMap);
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  const directSet = new Set(directFollowingIds);
  const secondLevelSet = new Set(secondLevelFollowingIds);

  // Map posts with Authored/Following/Network/Featured labels
  return mapPostsWithInteractions(
    postsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    directSet,
    secondLevelSet
  );
}

/**
 * Fetch posts for "Following" tab
 * Returns: Only posts from users the current user follows (excludes own posts)
 */
export async function fetchFollowingPosts(limit?: number, offset?: number): Promise<Post[]> {
  const user = await getCurrentUser();

  // Get list of users the current user is following
  const followingIds = await getFollowingIds();

  // If not following anyone, return empty array
  if (followingIds.length === 0) {
    return [];
  }

  // Fetch posts only from followed users (exclude own posts)
  let postsData: any[] | null = null;
  let postsError: any = null;

  let query = supabase
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
      comments:comments(count),
      shares:shares(count)
    `,
      { count: "exact" }
    )
    .in("user_id", followingIds)
    .order("created_at", { ascending: false });

  // Apply pagination if provided
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  if (offset !== undefined) {
    query = query.range(offset, offset + (limit ?? 10) - 1);
  }

  const result = await query;
  postsData = result.data;
  postsError = result.error;

  if (postsError) {
    console.error("Error fetching Following posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Apply fallback for user data if needed
  const needsFallback = postsData.length > 0 && postsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const userIds = [...new Set(postsData.map((p) => p.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const usersMap = await fetchUserDataFallback(userIds);
      applyUserDataFallback(postsData, usersMap);
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  const directSet = new Set(followingIds);
  const secondLevelSet = new Set<string>();

  return mapPostsWithInteractions(
    postsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    directSet,
    secondLevelSet
  );
}

/**
 * Fetch posts for "Explore" page
 * Returns: All posts from all users in random order (global content).
 * Pass shuffleSeed to get a stable order for the same seed (avoids flicker when load runs twice, e.g. Strict Mode).
 */
export async function fetchExplorePosts(limit?: number, offset?: number, shuffleSeed?: number): Promise<Post[]> {
  const user = await getCurrentUser();

  // Fetch ALL posts (no filtering, no ordering - we'll randomize after)
  let postsData: any[] | null = null;
  let postsError: any = null;

  let query = supabase
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
      comments:comments(count),
      shares:shares(count)
    `,
      { count: "exact" }
    );

  // Note: We don't order by created_at here because we want random order
  // shuffleSeed makes the order stable for the same seed (same visit / refresh)

  const result = await query;
  postsData = result.data;
  postsError = result.error;

  if (postsError) {
    console.error("Error fetching Explore posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Shuffle: use seed when provided so multiple fetches in same session show same order (no flicker)
  const shuffledPostsData = shuffleArray(postsData, shuffleSeed);

  // Apply pagination after shuffling
  let paginatedPostsData = shuffledPostsData;
  if (limit !== undefined || offset !== undefined) {
    const start = offset ?? 0;
    const end = limit !== undefined ? start + limit : undefined;
    paginatedPostsData = shuffledPostsData.slice(start, end);
  }

  // Apply fallback for user data if needed
  const needsFallback = paginatedPostsData.length > 0 && paginatedPostsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const userIds = [...new Set(paginatedPostsData.map((p) => p.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const usersMap = await fetchUserDataFallback(userIds);
      applyUserDataFallback(paginatedPostsData, usersMap);
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  // Get direct and 2nd-level following for post source labels
  let directFollowingIds: Set<string> = new Set();
  let secondLevelFollowingIds: Set<string> = new Set();
  try {
    const following = await getFollowingIds();
    directFollowingIds = new Set(following);
    secondLevelFollowingIds = new Set(await getSecondLevelFollowingIds(following));
  } catch (error) {
    console.warn("Failed to fetch following IDs:", error);
  }

  // Map posts
  return mapPostsWithInteractions(
    paginatedPostsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    directFollowingIds,
    secondLevelFollowingIds
  );
}

/**
 * Fetch posts for "My Feed" tab
 * Returns: Only posts from the current user
 */
export async function fetchMyPosts(limit?: number, offset?: number): Promise<Post[]> {
  const user = await getCurrentUser();

  // Fetch posts only from the current user
  let postsData: any[] | null = null;
  let postsError: any = null;

  let query = supabase
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
      comments:comments(count),
      shares:shares(count)
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Apply pagination if provided
  if (limit !== undefined) {
    query = query.limit(limit);
  }
  if (offset !== undefined) {
    query = query.range(offset, offset + (limit ?? 10) - 1);
  }

  const result = await query;
  postsData = result.data;
  postsError = result.error;

  if (postsError) {
    console.error("Error fetching My Feed posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Apply fallback for user data if needed
  const needsFallback = postsData.length > 0 && postsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, username, first_name, last_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (!usersError && usersData) {
      postsData.forEach((post) => {
        if (!hasPostAuthorData(post as { users?: unknown; user_id?: string })) {
          (post as { users?: SupabaseUser[] }).users = [usersData];
        }
      });
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  // My Feed = only own posts → all "authored" (direct/secondLevel empty)
  return mapPostsWithInteractions(
    postsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    new Set(),
    new Set()
  );
}

/**
 * Fetch posts for a specific user's profile
 * Returns: All posts by that user
 */
export async function fetchUserPosts(userId: string): Promise<Post[]> {
  const user = await getCurrentUser();

  // Fetch posts from the specified user
  let postsData: any[] | null = null;
  let postsError: any = null;

  const query = supabase
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
      comments:comments(count),
      shares:shares(count)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const result = await query;
  postsData = result.data;
  postsError = result.error;

  if (postsError) {
    console.error("Error fetching user posts:", postsError);
    throw new Error(postsError.message);
  }

  if (!postsData) return [];

  // Apply fallback for user data if needed
  const needsFallback = postsData.length > 0 && postsData.some((p) => !hasPostAuthorData(p as { users?: unknown; user_id?: string }));
  if (needsFallback) {
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, username, first_name, last_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (!usersError && usersData) {
      postsData.forEach((post) => {
        if (!hasPostAuthorData(post as { users?: unknown; user_id?: string })) {
          (post as { users?: SupabaseUser[] }).users = [usersData];
        }
      });
    }
  }

  // Fetch user interactions
  const { likedPostIds, sharedPostIds, savedPostIds } = await fetchUserInteractions(user.id);

  // Direct = users we follow (so posts from this profile get "following" if we follow them, "featured" otherwise; "authored" when viewing own profile)
  let directSet = new Set<string>();
  try {
    const following = await getFollowingIds();
    directSet = new Set(following);
  } catch (error) {
    console.warn("Failed to fetch following IDs:", error);
  }

  return mapPostsWithInteractions(
    postsData as Omit<SupabasePostRow, "user_liked" | "user_shared" | "user_saved">[],
    likedPostIds,
    sharedPostIds,
    savedPostIds,
    user.id,
    directSet,
    new Set()
  );
}
