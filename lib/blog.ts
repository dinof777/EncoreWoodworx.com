import fs from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  cover?: string;
  excerpt?: string;
  body: string[];
  products?: { name: string; subtitle?: string; price?: string; url?: string }[];
  sourceUrl?: string;
};

const POSTS_DIR = path.join(process.cwd(), "data", "posts");

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const posts: BlogPost[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf-8");
      posts.push(JSON.parse(raw) as BlogPost);
    }
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (e) {
    console.warn("[blog] couldn't read posts dir", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as BlogPost;
  } catch {
    return null;
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
