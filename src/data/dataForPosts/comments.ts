import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/api";
import { getCurrentUser, ensureUserRowExists } from "./currentUser";

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null
) {
  const user = await getCurrentUser();
  await ensureUserRowExists();

  const insertPayload: { post_id: string; user_id: string; content: string; parent_id?: string | null } = {
    post_id: postId,
    user_id: user.id,
    content,
  };
  if (parentId != null) {
    insertPayload.parent_id = parentId;
  }

  const { data: commentData, error } = await supabase
    .from("comments")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (post && post.user_id !== user.id && commentData) {
    await supabase.from("notifications").insert({
      user_id: post.user_id,
      actor_id: user.id,
      post_id: postId,
      comment_id: commentData.id,
      type: "comment",
    });
  }
}

function mapCommentRow(comment: Record<string, unknown>): Comment {
  let userData: { username: string; avatar_url: string | null } = {
    username: "user",
    avatar_url: null,
  };
  const users = comment.users as
    | { username?: string; avatar_url?: string | null }
    | { username?: string; avatar_url?: string | null }[]
    | undefined;
  if (users) {
    const u = Array.isArray(users) && users.length > 0 ? users[0] : users;
    if (u && typeof u === "object" && "username" in u) {
      userData = { username: u.username ?? "user", avatar_url: u.avatar_url ?? null };
    }
  }
  return {
    id: comment.id as string,
    content: comment.content as string,
    created_at: comment.created_at as string,
    post_id: comment.post_id as string,
    user_id: comment.user_id as string,
    parent_id: (comment.parent_id as string | null) ?? null,
    users: userData,
  };
}

/** Fetches all comments for a post and returns them as a tree: top-level comments with nested replies. */
export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      post_id,
      user_id,
      parent_id,
      users(username, avatar_url)
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) return [];

  const rows = data.map((c) => mapCommentRow(c as Record<string, unknown>));
  const byId = new Map<string, Comment>();
  const roots: Comment[] = [];

  rows.forEach((c) => {
    const node: Comment = { ...c, replies: [] };
    byId.set(c.id, node);
  });

  rows.forEach((c) => {
    const node = byId.get(c.id)!;
    const parentId = c.parent_id ?? null;
    if (!parentId) {
      roots.push(node);
    } else {
      const parent = byId.get(parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  roots.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  roots.forEach((r) => {
    if (r.replies && r.replies.length > 0) {
      r.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
  });

  return roots;
}

/** Delete a comment. Only the comment author can delete their own comment. */
export async function deleteComment(commentId: string): Promise<void> {
  const user = await getCurrentUser();

  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("id, user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_id !== user.id) {
    throw new Error("You can only delete your own comments");
  }

  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
}
