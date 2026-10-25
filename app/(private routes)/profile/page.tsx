"use client";

import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import css from "./ProfilePage.module.css"; // або відповідний файл стилів з репозиторію

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <main className={css.profileContainer}>
      <div className={css.profileCard}>
        <h1 className={css.title}>Profile</h1>

        <div className={css.infoGroup}>
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
