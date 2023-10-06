/* eslint-disable @next/next/no-img-element */
/**
 * Warning: Opening too many live preview tabs will slow down performance.
 * We recommend closing them after you're done.
 */
import React from 'react'
import './global.css'
import Sidebar from '../components/Sidebar'

const Home = () => {
  const pageId = 'Start'

  return (
    <>
      <Sidebar pageId={pageId} />
      <div>a great start waiting to be copleted by this weekend</div>
    </>
  )
}
export default Home
