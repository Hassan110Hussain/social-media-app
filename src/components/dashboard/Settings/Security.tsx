"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ICONS from "@/components/assets/icons";

interface SecurityProps {
  onMessage: (message: { type: "success" | "error"; text: string } | null) => void;
}

const Security = ({ onMessage }: SecurityProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      onMessage({
        type: "error",
        text: "All password fields are required",
      });
      return;
    }

    if (newPassword.length < 6) {
      onMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      onMessage({
        type: "error",
        text: "New password and confirm password do not match",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      onMessage(null);

      // Get current user email to verify old password
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error("User not found");
      }

      // Verify old password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // If old password is correct, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onMessage({
        type: "success",
        text: "Password updated successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => onMessage(null), 3000);
    } catch (error) {
      console.error("Failed to change password:", error);
      onMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to change password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Change Password</h2>
      
      <div className="space-y-4">
        {/* Old Password */}
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label={showOldPassword ? "Hide password" : "Show password"}
            >
              <img src={showOldPassword ? ICONS.hide : ICONS.show} alt="" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              <img src={showNewPassword ? ICONS.hide : ICONS.show} alt="" className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Must be at least 6 characters</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <img src={showConfirmPassword ? ICONS.hide : ICONS.show} alt="" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Change Password Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            {isChangingPassword ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Security;
