import { cookies } from "next/headers";
import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

// Допоміжна функція для отримання кук на сервері
const getAuthHeaders = () => {
  const cookieStore = cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export async function fetchNotes(
  page = 1,
  search = "",
  tag = "",
): Promise<{ notes: Note[]; totalPages: number }> {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag && tag !== "all") {
    params.tag = tag;
  }
  const response = await api.get("/notes", {
    ...getAuthHeaders(),
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`, getAuthHeaders());
  return response.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get<User>("/auth/session", getAuthHeaders());
    return response.data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", getAuthHeaders());
  return response.data;
}
