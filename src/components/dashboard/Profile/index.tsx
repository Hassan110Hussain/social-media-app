"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Post, UserProfile, Comment } from "@/types/api";
import { fetchUserPosts, fetchComments, createComment, toggleLikePost, toggleSavePost, toggleSharePost } from "@/lib/posts";
import { fetchCurrentUserProfile, updateUserProfile } from "@/lib/profile";
import { toggleFollowUser } from "@/lib/follows";
import Loader from "@/components/common/Loader";
import PostDetailOverlay from "@/components/common/PostDetailOverlay";
import ScrollPaginationSentinel from "@/components/common/ScrollPagination";
import ICONS from "@/components/assets/icons";
import { supabase } from "@/lib/supabase";

const POSTS_PER_PAGE = 12;

const Profile = () => {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const [profile, setProfile] = useState<(UserProfile & { 
    followingCount: number; 
    followerCount: number; 
    isFollowing: boolean;
    isOwnProfile: boolean;
  }) | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState<boolean>(false);
  const [overlayPost, setOverlayPost] = useState<Post | null>(null);
  const [overlayComments, setOverlayComments] = useState<Comment[]>([]);
  const [isLoadingOverlayComments, setIsLoadingOverlayComments] = useState<boolean>(false);
  const [overlayCommentInput, setOverlayCommentInput] = useState<string>("");
  const [isSubmittingOverlayComment, setIsSubmittingOverlayComment] = useState<boolean>(false);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(ICONS.land);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch current user's profile
        const userProfile = await fetchCurrentUserProfile();
        setProfile(userProfile);
        
        // Set edit form with current values
        setEditForm({
          username: userProfile.username || "",
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          bio: userProfile.bio || "",
        });

        // Fetch user's posts (first page)
        const userPosts = await fetchUserPosts(userProfile.id, POSTS_PER_PAGE, 0);
        setPosts(userPosts);
        setHasMore(userPosts.length === POSTS_PER_PAGE);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to load profile right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  // Load current user (for overlay comment form)
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: row } = await supabase.from("users").select("avatar_url").eq("id", user.id).maybeSingle();
          if (row?.avatar_url) {
            setCurrentUserAvatar(row.avatar_url);
          }
        }
      } catch (e) {
        console.error("Failed to load current user:", e);
      }
    };
    void loadCurrentUser();
  }, []);

  // Refresh avatar when profile changes
  useEffect(() => {
    if (profile?.avatar_url) {
      setCurrentUserAvatar(profile.avatar_url);
    }
  }, [profile?.avatar_url]);

  // Load more posts when scrolling
  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore || !profile) return;

    try {
      setIsLoadingMore(true);
      const currentOffset = posts.length;
      const newPosts = await fetchUserPosts(profile.id, POSTS_PER_PAGE, currentOffset);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadOverlayComments = useCallback(async (postId: string) => {
    try {
      setIsLoadingOverlayComments(true);
      const list = await fetchComments(postId);
      setOverlayComments(list);
    } catch (e) {
      console.error("Failed to load overlay comments:", e);
      setOverlayComments([]);
    } finally {
      setIsLoadingOverlayComments(false);
    }
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setOverlayPost(null);
    setOverlayComments([]);
    setOverlayCommentInput("");
  }, []);

  const handleOverlayCommentSubmit = async (content: string) => {
    if (!overlayPost || !content.trim() || isSubmittingOverlayComment) return;
    try {
      setIsSubmittingOverlayComment(true);
      await createComment(overlayPost.id, content.trim());
      setOverlayCommentInput("");
      const updated = await fetchComments(overlayPost.id);
      setOverlayComments(updated);
      setPosts((prev) => prev.map((p) => (p.id === overlayPost.id ? { ...p, comments: p.comments + 1 } : p)));
      setOverlayPost((p) => (p && p.id === overlayPost.id ? { ...p, comments: p.comments + 1 } : p));
    } catch (e) {
      console.error("Failed to submit comment:", e);
    } finally {
      setIsSubmittingOverlayComment(false);
    }
  };

  const handleOverlayLike = async (postId: string) => {
    const prevPosts = [...posts];
    const prevOverlay = overlayPost;
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : null));
    try {
      await toggleLikePost(postId);
    } catch (e) {
      console.error("Failed to toggle like:", e);
      setPosts(prevPosts);
      if (prevOverlay?.id === postId) setOverlayPost(prevOverlay);
    }
  };

  const handleOverlaySave = async (postId: string) => {
    const prevPosts = [...posts];
    const prevOverlay = overlayPost;
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, saved: !x.saved } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, saved: !p.saved } : null));
    try {
      await toggleSavePost(postId);
    } catch (e) {
      console.error("Failed to toggle save:", e);
      setPosts(prevPosts);
      if (prevOverlay?.id === postId) setOverlayPost(prevOverlay);
    }
  };

  const handleOverlayShare = async (postId: string) => {
    const prevPosts = [...posts];
    const prevOverlay = overlayPost;
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, shared: !x.shared, shares: x.shared ? x.shares - 1 : x.shares + 1 } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, shared: !p.shared, shares: p.shared ? p.shares - 1 : p.shares + 1 } : null));
    try {
      await toggleSharePost(postId);
    } catch (e) {
      console.error("Failed to toggle share:", e);
      setPosts(prevPosts);
      if (prevOverlay?.id === postId) setOverlayPost(prevOverlay);
    }
  };

  const hasEditChanges =
    profile &&
    (editForm.username.trim() !== (profile.username ?? "").trim() ||
      editForm.first_name.trim() !== (profile.first_name ?? "").trim() ||
      editForm.last_name.trim() !== (profile.last_name ?? "").trim() ||
      editForm.bio.trim() !== (profile.bio ?? "").trim());

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      await updateUserProfile(editForm);
      
      // Refresh profile
      const updatedProfile = await fetchCurrentUserProfile();
      setProfile(updatedProfile);
      
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!profile || profile.isOwnProfile) return;

    try {
      setIsTogglingFollow(true);
      const isNowFollowing = await toggleFollowUser(profile.id);
      
      // Update profile state
      setProfile((prev) => 
        prev ? {
          ...prev,
          isFollowing: isNowFollowing,
          followerCount: isNowFollowing ? prev.followerCount + 1 : prev.followerCount - 1,
        } : null
      );
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      alert("Failed to update follow status. Please try again.");
    } finally {
      setIsTogglingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Loader title="Loading profile..." subtitle="Almost there" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-rose-500 dark:text-rose-400">{error || "Profile not found"}</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRootRef}
      className="h-screen overflow-y-auto px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Header */}
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-800 sm:h-32 sm:w-32">
              <Image
                key={profile.avatar_url || 'default'}
                src={profile.avatar_url || ICONS.land}
                alt={profile.username || "Profile"}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = ICONS.land;
                }}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.username || "User"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    @{profile.username}
                  </p>
                </div>
                {profile.isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={isTogglingFollow}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
                      profile.isFollowing
                        ? "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {isTogglingFollow ? "..." : profile.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{posts.length}</span>
                  <span className="ml-1 text-slate-500 dark:text-slate-400">posts</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.followerCount}</span>
                  <span className="ml-1 text-slate-500 dark:text-slate-400">followers</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.followingCount}</span>
                  <span className="ml-1 text-slate-500 dark:text-slate-400">following</span>
                </div>
              </div>

              {/* Bio */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving || !hasEditChanges}
                    className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <div>
                  {profile.bio ? (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{profile.bio}</p>
                  ) : profile.isOwnProfile ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                      No bio yet. Click "Edit Profile" to add one.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Posts</h2>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <p className="font-semibold">No posts yet</p>
              {profile.isOwnProfile && (
                <p className="mt-1 text-xs">Start sharing your thoughts and ideas!</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                const thumbUrl = post.imageUrls?.length ? post.imageUrls[0] : post.imageUrl;
                return (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setOverlayPost(post);
                      setOverlayCommentInput("");
                      setOverlayComments([]);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white/90 text-left shadow-sm shadow-slate-200 backdrop-blur transition hover:-translate-y-[2px] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none"
                  >
                    {thumbUrl ? (
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                        <Image
                          src={thumbUrl}
                          alt={post.caption}
                          fill
                          className="object-cover transition group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = ICONS.solid;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-slate-100 p-4 dark:bg-slate-800">
                        <p className="line-clamp-6 text-sm text-slate-600 dark:text-slate-300">
                          {post.caption}
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition group-hover:opacity-100">
                      <div className="flex items-center gap-3 text-xs text-white">
                        <span>♥ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>📤 {post.shares}</span>
                      </div>
                    </div>
                    {(post.imageUrls?.length ?? 0) > 1 && (
                      <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                        {(post.imageUrls?.length ?? 0)} photos
                      </span>
                    )}
                  </button>
                );
              })}
              </div>
              <ScrollPaginationSentinel
                onLoadMore={loadMorePosts}
                hasMore={hasMore}
                isLoading={isLoadingMore}
                root={scrollRootRef.current}
              />
            </>
          )}
        </section>
      </div>

      <PostDetailOverlay
        post={overlayPost}
        onClose={handleCloseOverlay}
        comments={overlayComments}
        isLoadingComments={isLoadingOverlayComments}
        onOpen={loadOverlayComments}
        currentUserAvatar={currentUserAvatar}
        currentUserId={currentUserId}
        commentInput={overlayCommentInput}
        onCommentInputChange={setOverlayCommentInput}
        onSubmitComment={handleOverlayCommentSubmit}
        isSubmittingComment={isSubmittingOverlayComment}
        onLike={handleOverlayLike}
        onShare={handleOverlayShare}
        onSave={handleOverlaySave}
      />
    </div>
  );
};

export default Profile;
