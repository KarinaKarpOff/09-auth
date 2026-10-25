import { api } from "./api";
import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

// Попередні функції нотаток
export async function fetchNotes(
  page = 1,
  search = "",
  tag = "",
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag && tag !== "all") {
    params.tag = tag;
  }
  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

// Нові функції для авторизації та користувачів (клієнтські)
export async function register(credentials: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await api.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User>("/auth/session");
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(payload: { username: string }): Promise<User> {
  const response = await api.patch<User>("/users/me", payload);
  return response.data;
}
