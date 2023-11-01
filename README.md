# Logic Flow - A better alternative to logisim

- realtime collaboration
- sharing with others
- easy to check assignments for tutors
- and one click submit assignments for the students

## Description

Logoc Flow is built with instituions 

The Ably fundamentals demonstrated within this repo are:

- space

The project uses the following components:

- [Next.js](https://nextjs.org), a flexible React framework that gives you building blocks to create fast web applications.
- [Ably](https://ably.com?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo), for realtime messaging at scale.
- [Firebase](https://firebase.google.com/) for authentication and firestore database

## Building & running locally

### Prerequisites

1. [Sign up](https://ably.com/signup?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo) or [log in](https://ably.com/login?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo) to ably.com, and [create a new app and copy the API key](https://faqs.ably.com/setting-up-and-managing-api-keys?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo).
2. To deploy to [Vercel](https://vercel.com), create a Vercel account.

### Configure the app

Create a `.env.local` file with your Ably API key:

```bash
echo "ABLY_API_KEY={YOUR_ABLY_API_KEY_HERE}">.env
```

### Run the Next.js app

```bash
npm run dev
# or
yarn dev
```

## Deploy on Vercel

currently deploying on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) will fail due to incompatibity of fabric js canvas. A better alternative such as [Pixi Js](https://pixijs.com/) should be used.

## Contributing

Welcome! Please contact me before making any contributions.

