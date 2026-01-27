import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "./currentUser";

export type UpdatePostInput = {
  content: string;
  imageUrl?: string | null;
};

export async function updatePost(postId: string, input: UpdatePostInput): Promise<void> {
  const user = await getCurrentUser();

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message || "Post not found");
  }

  if (post.user_id !== user.id) {
    throw new Error("You can only edit your own posts");
  }

  const updates: { content: string; image_url?: string | null } = {
    content: input.content.trim(),
  };
  if (input.imageUrl !== undefined) {
    updates.image_url = input.imageUrl;
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error(updateError.message || "Failed to update post");
  }
}
