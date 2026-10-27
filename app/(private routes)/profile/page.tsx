import { getMe } from "@/lib/api/serverApi";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile - NoteHub",
  description: "User profile page",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.profileContainer}>
      <div className={css.profileCard}>
        <h1 className={css.FormTitle}>Profile</h1>

        <div className={css.userInfo}>
          {user?.avatar && (
            <div className={css.avatarWrapper}>
              <Image
                src={user.avatar}
                alt={user.username || "User avatar"}
                width={100}
                height={100}
                className={css.avatar}
              />
            </div>
          )}
          <div className={css.profileInfo}>
            <p className={css.label}>Username:</p>
            <p className={css.value}>
              {user?.username || "No username available"}
            </p>
          </div>
        </div>

        <div className={css.profileInfo}>
          <p className={css.label}>Email:</p>
          <p className={css.value}>{user?.email || "No email available"}</p>
        </div>

        <div className={css.actions}>
          <Link href="/profile/edit" className={css.editButton}>
            Edit Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
