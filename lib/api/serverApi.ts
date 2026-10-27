import { cookies } from "next/headers";
import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import type { AxiosResponse } from "axios";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
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

  const authHeaders = await getAuthHeaders();
  const response = await api.get("/notes", {
    ...authHeaders,
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, authHeaders);
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse<User>> {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<User>("/auth/session", authHeaders);
  return response;
}

export async function getMe(): Promise<User> {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<User>("/users/me", authHeaders);
  return response.data;
}
