export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Image uploading is not configured. IMGBB_API_KEY is missing." }, { status: 500 });
  }

  try {
    const data = await request.formData();
    const image = data.get("image");
    if (!(image instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 5 * 1024 * 1024) {
      return Response.json({ error: "Choose a JPG, PNG or WebP image no larger than 5 MB." }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.url) {
      return Response.json({ error: "Image upload failed. Please try again." }, { status: 502 });
    }
    return Response.json({ url: result.data.url });
  } catch {
    return Response.json({ error: "Image upload failed. Please try again." }, { status: 502 });
  }
}
