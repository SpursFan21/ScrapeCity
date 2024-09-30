import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/test')({
  component: TextComponent,
})

function TextComponent() {
  return (
    <div>
      <h1>Text Components</h1>
      <p>Text components are a great way to display text in your app.</p>
    </div>
  )
}
