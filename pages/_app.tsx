import type { AppProps } from 'next/app'
import '../styles/index.css'
import Navabr from 'components/Navabr'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navabr />
      <Component {...pageProps} />
    </div>
  )
}
