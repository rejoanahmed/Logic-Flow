# Logic Flow - A better alternative to logisim
## Inspiration
Logic Flow emerged from the frustrations of computer science students, seeking to streamline the assignment submission process. Inspired by the inconveniences of using Logisim and the need for real-time collaboration.

## What it does
- realtime collaboration
- sharing with others
- easy to check assignments for tutors
- and one click submit assignments for the students
- and general purpose logic gate building
  
## How we built it
Logic Flow is built with the following tech stack
- [Next.js](https://nextjs.org), a flexible React framework that gives you building blocks to create fast web applications.
- [Ably](https://ably.com?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo), for realtime messaging at scale. (ably-space in particular)
- [Firebase](https://firebase.google.com/) for authentication and firestore database
- [Fabric JS](http://fabricjs.com/) for drawing logic gates

## Challenges we ran into
The first challenge we ran into was related to fabric js. While deploying our project to vercel, it would fail at the build phase. After diggin for hours and searching for solutions, we figured, its not compatible with node v18, but we could not downgrade to v-16 because other projects has minimum requirement. An instant regret of chosing fabric JS hit us. Anyway, since our local server is working and we figured this at the elventh hour, we could not have the time to migrate from fabric to other solution.

The next challenge was due to a bug in `useMembers()` hook from `@ably/spaces/react` which always returns an empty array. Later we had to use other way, manually subscribing to sapce members.

our local build would also fail sometimes because, next js recognizes `@ably/spaces/react` as commonjs module. Surprising enough, our dev server is running just fine.

## Accomplishments that we're proud of
The Logic Flow team is proud of the following accomplishments:

- Successfully implementing realtime collaboration using Ably's messaging service.
- Developing a feature that allows tutors to easily check assignments.
- Implementing a one-click submit feature for students to submit their assignments.
- Building a versatile logic gate building tool
- Integrating Firebase for authentication and Firestore database functionality.

Overall, the team is proud of the progress made in creating a streamlined and collaborative platform for logic gate assignments, despite the challenges encountered along the way.

## What we learned
Our biggest takeaway from this project was the impressive capability of Ably's Realtime Messaging service. Building a collaborative app with real-time updates allowed us to explore the challenges of concurrent editing.

## What's next for Logic Flow
Moving forward, Logic Flow has exciting plans for further development and enhancement. Our immediate focus is on migrating from fabric JS to pixi JS, which will provide a more robust and efficient solution for drawing on the canvas. Additionally, we aim to implement simulation capabilities and a clock feature to enhance the functionality of the app. Furthermore, saving the board functionality will be implemented to ensure user convenience and persistence of their work. We are enthusiastic about these upcoming improvements.

## Building & running locally

### Prerequisites

1. [Sign up](https://ably.com/signup?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo) or [log in](https://ably.com/login?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo) to ably.com, and [create a new app and copy the API key](https://faqs.ably.com/setting-up-and-managing-api-keys?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-fundamentals-kit&utm_content=ably-nextjs-fundamentals-kit&src=GLB-2211-ably-nextjs-fundamentals-kit-github-repo).
2. create a firebase proejct
3. To deploy to [Vercel](https://vercel.com), create a Vercel account.

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

