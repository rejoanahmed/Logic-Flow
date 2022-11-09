import Layout from '../components/layout';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
      <Layout
        title={"Ably and Next.js template"}
        description={"Ably and Next.js template"}
      >
        <h1 className={styles.title}>
          <a href="https://ably.com/?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-template&utm_content=ably-nextjs-template&src=GLB-2211-ably-nextjs-template-github-repo">Ably</a> &amp; <a href="https://nextjs.org">Next.js</a> starter template
        </h1>

        <p className={styles.description}>
          This template demonstrates using some of the Ably fundamentals with Next.js. You can the build features and use cases upon these fundamentals such as notifications, activity streams, chat, realtime visualisations and dashboards, and collaborative multiplayer experiences.
        </p>

        <div className={styles.grid}>
          <a href="./authentication" className={styles.card}>
            <h2>Token Authentication &rarr;</h2>
            <p>Token Authentication is the recommeded approach for auth with Ably.</p>
          </a>

          <a href="./pub-sub" className={styles.card}>
            <h2>Pub/Sub &rarr;</h2>
            <p>Pub/Sub (Publish/Subscribe) with Ably lets you publish messages on channels and subscribe to channels to receive messages.</p>
          </a>

          <a
            href="./presence"
            className={styles.card}
          >
            <h2>Presence &rarr;</h2>
            <p>Presence with Ably allows you to keep track of devices that are present on a channel. This is great for tracking if a device is online or offline or indicating if a user is in a chat room when using Ably for Chat.</p>
          </a>

          <a
            href="./history"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>History &rarr;</h2>
            <p>
              Ably persists messages for 2 minutes by default. But this can be increase to 24 - 72 hours.
            </p>
          </a>
        </div>
      </Layout>
  )
}
