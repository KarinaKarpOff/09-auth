import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const note = await fetchNoteById(resolvedParams.id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 150),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.slice(0, 150),
        url: `https://notehub.com/notes/${note.id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note | NoteHub",
      description: "View note details in NoteHub.",
    };
  }
}
export default async function NotePage() {
  return (
    <main>
      <NoteDetailsClient />
    </main>
  );
}
