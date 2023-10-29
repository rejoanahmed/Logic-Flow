import CircuitBuilder from './circuit-builder'
import Constants from '@borrowed/constants'
import React, { Component } from 'react'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <div className='h-full'>
      <div>
        <Toaster />
      </div>
      <CircuitBuilder />
    </div>
  )
}
