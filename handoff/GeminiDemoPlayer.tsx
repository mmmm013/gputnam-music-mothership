"use client"

import React, { useRef } from 'react'

export default function GeminiDemoPlayer({ item }: { item: any }) {
  const beforeRef = useRef<HTMLAudioElement | null>(null)
  const afterRef = useRef<HTMLAudioElement | null>(null)

  const beforeSrc = (() => {
    if (!item || !item.source_path) return ''
    return '/' + item.source_path.replace(/^public\//, '')
  })()

  const afterSrc = (() => {
    // Prefer preview MP3 if listed in notes, otherwise map processed_master into a public path
    if (item.notes && typeof item.notes === 'string' && item.notes.includes('preview')) {
      const file = item.notes.split(':').pop()?.trim() || item.notes
      return '/' + file.replace(/^handoff\//, 'handoff/')
    }
    if (item.processed_master) {
      const name = item.processed_master.split('/').pop()
      return '/handoff/processed/' + name
    }
    return ''
  })()

  const syncPlay = async () => {
    try {
      if (beforeRef.current) beforeRef.current.currentTime = 0
      if (afterRef.current) afterRef.current.currentTime = 0
      const promises: Promise<void>[] = []
      if (beforeRef.current) promises.push(beforeRef.current.play().then(() => {}) as Promise<void>)
      if (afterRef.current) promises.push(afterRef.current.play().then(() => {}) as Promise<void>)
      await Promise.all(promises)
    } catch (e) {
      console.warn('Playback error', e)
    }
  }

  const stopBoth = () => {
    if (beforeRef.current) {
      beforeRef.current.pause()
      beforeRef.current.currentTime = 0
    }
    if (afterRef.current) {
      afterRef.current.pause()
      afterRef.current.currentTime = 0
    }
  }

  return (
    <section className="border rounded p-4">
      <h2 className="text-lg font-semibold">{item.title} — {item.artist}</h2>
      <p className="text-sm text-gray-600">{item.description}</p>
      <div className="mt-3 flex gap-4 items-start">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Before (source)</div>
          <audio ref={beforeRef} src={beforeSrc} controls className="w-full" preload="none" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">After (processed preview)</div>
          <audio ref={afterRef} src={afterSrc} controls className="w-full" preload="none" />
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={syncPlay} className="px-3 py-1 bg-blue-600 text-white rounded">Sync Play</button>
          <button onClick={stopBoth} className="px-3 py-1 bg-gray-300 rounded">Stop</button>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <strong>Moods:</strong> {item.moods?.join(', ') || '—'}<br />
        <strong>Instruments:</strong> {item.instruments?.join(', ') || '—'}
      </div>
    </section>
  )
}
