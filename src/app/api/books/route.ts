import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid book");
  } catch {
    return NextResponse.json({ error: "Invalid book" }, { status: 400 });
  }

  const book = {
    title: body.title,
    author: body.author,
    category: body.category,
    copies: body.copies,
    borrowDays: body.borrowDays,
    coverUrl: body.coverUrl,
    description: body.description,
    ownerName: session.user.name,
    ownerEmail: session.user.email,
  };
  if ([book.title, book.author, book.category, book.coverUrl, book.description].some((value) => typeof value !== "string" || !value.trim()) ||
      !Number.isInteger(Number(book.copies)) || Number(book.copies) < 1 ||
      !Number.isInteger(Number(book.borrowDays)) || Number(book.borrowDays) < 1) {
    return NextResponse.json({ error: "Invalid book details" }, { status: 400 });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${apiUrl}/add-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Unable to publish book");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to publish book" }, { status: 502 });
  }
}
