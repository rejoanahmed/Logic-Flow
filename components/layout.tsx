import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Layout.module.css'

type LayoutProps = {
  children: React.ReactNode,
  pageTitle?: string,
  metaDescription: string,
}

export default function Layout({ children, pageTitle, metaDescription }: LayoutProps) {
  const headTitle = (pageTitle? `${pageTitle} - ` : '') + 'Ably and Next.js starter template'
  return (
    <div className={styles.container}>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="https://static.ably.dev/motif-red.svg?ably-nextjs-template" type="image/svg+xml" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://ably.com/?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-template&utm_content=ably-nextjs-template&src=GLB-2211-ably-nextjs-template-github-repo">Ably</a> &amp; <a href="https://nextjs.org">Next.js</a> starter template
        </h1>

        {pageTitle && <h2>{pageTitle}</h2>}

        {children}
      </main>
      <footer className={styles.footer}>
        Powered by{' '}
        <span className={styles.logo}>
          <a
            href="https://ably.com/?utm_source=github&utm_medium=github-repo&utm_campaign=GLB-2211-ably-nextjs-template&utm_content=ably-nextjs-template&src=GLB-2211-ably-nextjs-template-github-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="https://static.ably.dev/logo-h-mono-black.svg?ably-nextjs-template" alt="Ably Logo" width={102} height={18} />
          </a>
        </span>
        &amp;
        <span className={styles.logo}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=ably-nextjs-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={16} />
          </a>
        </span>
      </footer>
    </div>
  )
}