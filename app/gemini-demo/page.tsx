import fs from 'fs'
import path from 'path'
import GeminiDemoPlayer from '../../handoff/GeminiDemoPlayer'

export default function Page() {
  const metaPath = path.join(process.cwd(), 'handoff', 'metadata.json')
  let items: any[] = []
  try {
    const raw = fs.readFileSync(metaPath, 'utf8')
    items = JSON.parse(raw)
  } catch (e) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Gemini Audio Demo</h1>
        <p className="mb-2">No metadata found at <code>handoff/metadata.json</code>.</p>
        <p>Add processed previews to <code>public/handoff/processed/</code> (or adjust paths) and update the metadata, then reload.</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gemini Audio Demo</h1>
      <div className="space-y-6">
        {items.map((item) => (
          // @ts-ignore - client component prop typing is simple here
          <GeminiDemoPlayer key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
