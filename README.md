This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### BookNook production configuration

- Deploy the latest frontend commit. The green/mint theme is defined in `src/app/globals.css`; Tailwind is compiled through `postcss.config.mjs`. Do not reintroduce HeroUI's global theme stylesheet or the old custom Turbopack CSS loader.
- `npm run build` uses Next's webpack production builder. This build path is verified here; the local Turbopack production build currently fails in its React compiler worker with an out-of-memory error.
- Set `NEXT_PUBLIC_API_URL=https://book-nook-server-nine.vercel.app` and `BETTER_AUTH_URL=https://book-nook-client-ten.vercel.app` in the frontend project's Production environment.
- Configure the frontend's `BETTER_AUTH_SECRET`, `MONGODB_URI`, OAuth credentials, and `IMGBB_API_KEY` in Vercel. Never commit their values. Image uploads use `/api/upload-image` so the ImgBB key stays on the server.
- In the backend project, set `CLIENT_URL=https://book-nook-client-ten.vercel.app` and the intended `MONGODB_URI`.
- Public environment variables are embedded during the frontend build. Redeploy after changing them. When replacing the old theme/build configuration, redeploy with the existing build cache disabled.
- Local development can keep its localhost URLs in `.env`. To share book records across environments, both backends must connect to the same intended MongoDB cluster/database.
- Keep `NEXT_PUBLIC_API_URL` without a trailing slash; request paths already start with `/`. After deployment, check `/api/auth/jwks` returns JSON with HTTP 200, then test Add Book → My Books, both Edit Book cover methods, and Borrow → My Borrows.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
