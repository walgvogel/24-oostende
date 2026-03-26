'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllArtikelen, getScans, getOpdrachten, getFeedback, getStats, updateArtikel, archiveerArtikel, publiceerArtikel, updateFeedbackStatus } from '@/lib/admin-queries'
import type { Artikel, Scan, Opdracht, Feedback, Vraag } from '@/lib/supabase'
import { categorieNamen } from '@/lib/categorieen'

type Stats = Awaited<ReturnType<typeof getStats>>
type Tab = 'overzicht' | 'artikelen' | 'opdrachten' | 'scans' | 'feedback' | 'vragen'

const statusKleuren: Record<string, string> = {
  gepubliceerd: 'bg-green-100 text-green-800',
  concept: 'bg-yellow-100 text-yellow-800',
  gearchiveerd: 'bg-gray-100 text-gray-800',
  nieuw: 'bg-blue-100 text-blue-800',
  in_onderzoek: 'bg-purple-100 text-purple-800',
  in_schrijffase: 'bg-orange-100 text-orange-800',
  in_revisie: 'bg-pink-100 text-pink-800',
  afgewezen: 'bg-red-100 text-red-800',
}

function formatDatum(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusKleuren[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function StatCard({ label, waarde, sub }: { label: string; waarde: number | string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-[#252540] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-3xl font-bold text-[#1e6091]">{waarde}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [tab, setTab] = useState<Tab>('overzicht')
  const [stats, setStats] = useState<Stats | null>(null)
  const [artikelen, setArtikelen] = useState<Artikel[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [opdrachten, setOpdrachten] = useState<Opdracht[]>([])
  const [feedback, setFeedback] = useState<(Feedback & { artikel_titel?: string })[]>([])
  const [vragen, setVragen] = useState<Vraag[]>([])
  const [laden, setLaden] = useState(false)

  const laadData = useCallback(async () => {
    setLaden(true)
    try {
      const [s, a, sc, o, f, v] = await Promise.all([
        getStats(), getAllArtikelen(), getScans(), getOpdrachten(), getFeedback(),
        fetch('/api/admin/vragen').then(r => r.ok ? r.json() : []).catch(() => [])
      ])
      setStats(s)
      setArtikelen(a)
      setScans(sc)
      setOpdrachten(o)
      setFeedback(f)
      setVragen(v)
    } catch (e) {
      console.error('Fout bij laden:', e)
    }
    setLaden(false)
  }, [])

  useEffect(() => {
    if (authenticated) laadData()
  }, [authenticated, laadData])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setFout('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wachtwoord }),
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        setFout('Verkeerd wachtwoord')
      }
    } catch {
      setFout('Verbindingsfout')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f2] dark:bg-[#1a1a2e]">
        <form onSubmit={login} className="bg-white dark:bg-[#252540] p-8 rounded-xl shadow-lg w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1e6091]">
              24<span className="text-[#f0a030]">/</span>Oostende
            </h1>
            <p className="text-sm text-gray-500 mt-1">Redactiedashboard</p>
          </div>
          <input
            type="password"
            value={wachtwoord}
            onChange={e => setWachtwoord(e.target.value)}
            placeholder="Wachtwoord"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-[#1a1a2e] dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-[#1e6091]"
            autoFocus
          />
          {fout && <p className="text-red-500 text-sm mb-3">{fout}</p>}
          <button type="submit" className="w-full bg-[#1e6091] text-white py-3 rounded-lg font-semibold hover:bg-[#174d73] transition-colors">
            Inloggen
          </button>
        </form>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overzicht', label: 'Overzicht' },
    { id: 'artikelen', label: `Artikelen (${artikelen.length})` },
    { id: 'opdrachten', label: `Opdrachten (${opdrachten.length})` },
    { id: 'scans', label: `Scans (${scans.length})` },
    { id: 'feedback', label: `Feedback (${feedback.length})` },
    { id: 'vragen', label: `Vragen (${vragen.length})` },
  ]

  return (
    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#1a1a2e]">
      {/* Header */}
      <div className="bg-white dark:bg-[#252540] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1e6091]">
              24<span className="text-[#f0a030]">/</span>Oostende
              <span className="text-gray-400 font-normal text-sm ml-2">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={laadData} disabled={laden} className="text-sm text-[#1e6091] hover:underline disabled:opacity-50">
              {laden ? 'Laden...' : 'Vernieuwen'}
            </button>
            <a href="/" className="text-sm text-gray-400 hover:text-gray-600">Site bekijken</a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#252540] border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="max-w-[1200px] mx-auto flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#1e6091] text-[#1e6091]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {tab === 'overzicht' && stats && <Overzicht stats={stats} />}
        {tab === 'artikelen' && <ArtikelenTab artikelen={artikelen} onUpdate={laadData} />}
        {tab === 'opdrachten' && <OpdrachtenTab opdrachten={opdrachten} />}
        {tab === 'scans' && <ScansTab scans={scans} />}
        {tab === 'feedback' && <FeedbackTab feedback={feedback} artikelen={artikelen} onUpdate={laadData} />}
        {tab === 'vragen' && <VragenTab vragen={vragen} artikelen={artikelen} onUpdate={laadData} />}
      </div>
    </div>
  )
}

function Overzicht({ stats }: { stats: Stats }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Gepubliceerd" waarde={stats.gepubliceerd} />
        <StatCard label="Concepten" waarde={stats.concept} />
        <StatCard label="Open opdrachten" waarde={stats.openOpdrachten} />
        <StatCard label="Nieuwe feedback" waarde={stats.nieuweFeedback} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Per categorie */}
        <div className="bg-white dark:bg-[#252540] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Artikelen per categorie</h3>
          {Object.entries(stats.perCategorie).length === 0 ? (
            <p className="text-gray-400 text-sm">Nog geen data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.perCategorie)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, aantal]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{categorieNamen[cat] || cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#1e6091] h-2 rounded-full"
                          style={{ width: `${Math.min(100, (aantal / Math.max(...Object.values(stats.perCategorie))) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6 text-right">{aantal}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Per week */}
        <div className="bg-white dark:bg-[#252540] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Publicaties per week</h3>
          <div className="flex items-end gap-3 h-32">
            {stats.perWeek.map((w, i) => {
              const max = Math.max(...stats.perWeek.map(x => x.aantal), 1)
              const hoogte = (w.aantal / max) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{w.aantal}</span>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t" style={{ height: '100px' }}>
                    <div
                      className="w-full bg-[#1e6091] rounded-t transition-all"
                      style={{ height: `${hoogte}%`, marginTop: `${100 - hoogte}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{w.week}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 bg-white dark:bg-[#252540] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Systeeminfo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-400">Totaal artikelen:</span> <strong>{stats.totaalArtikelen}</strong></div>
          <div><span className="text-gray-400">Totaal scans:</span> <strong>{stats.totaalScans}</strong></div>
          <div><span className="text-gray-400">Scheduled task:</span> <strong>6x/dag</strong></div>
          <div><span className="text-gray-400">Database:</span> <strong>Supabase</strong></div>
        </div>
      </div>
    </div>
  )
}

function ArtikelenTab({ artikelen, onUpdate }: { artikelen: Artikel[]; onUpdate: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const editArtikel = artikelen.find(a => a.id === editId)

  return (
    <div className="flex gap-6">
      {/* Tabel */}
      <div className={`bg-white dark:bg-[#252540] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${editId ? 'w-1/2' : 'w-full'} transition-all`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#1a1a2e]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Titel</th>
                {!editId && <th className="text-left px-4 py-3 font-medium text-gray-500">Categorie</th>}
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Datum</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {artikelen.map(a => (
                <tr key={a.id} className={`hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors cursor-pointer ${editId === a.id ? 'bg-blue-50 dark:bg-[#1e2d4a]' : ''}`} onClick={() => setEditId(a.id)}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{a.titel}</span>
                    <div className="text-xs text-gray-400 mt-0.5">{a.slug}</div>
                  </td>
                  {!editId && <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{categorieNamen[a.categorie_slug] || a.categorie_slug}</td>}
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDatum(a.publicatie_datum)}</td>
                  <td className="px-4 py-3">
                    <button onClick={(e) => { e.stopPropagation(); setEditId(a.id) }} className="text-[#1e6091] hover:underline text-xs">Bewerk</button>
                  </td>
                </tr>
              ))}
              {artikelen.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Geen artikelen gevonden</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit paneel */}
      {editId && editArtikel && (
        <ArtikelEditor artikel={editArtikel} onClose={() => setEditId(null)} onSaved={() => { onUpdate(); }} />
      )}
    </div>
  )
}

function ArtikelEditor({ artikel, onClose, onSaved }: { artikel: Artikel; onClose: () => void; onSaved: () => void }) {
  const [titel, setTitel] = useState(artikel.titel)
  const [samenvatting, setSamenvatting] = useState(artikel.samenvatting || '')
  const [inhoud, setInhoud] = useState(artikel.inhoud)
  const [categorie, setCategorie] = useState(artikel.categorie_slug)
  const [tags, setTags] = useState(artikel.tags?.join(', ') || '')
  const [status, setStatus] = useState(artikel.status)
  const [opslaan, setOpslaan] = useState(false)
  const [melding, setMelding] = useState('')

  useEffect(() => {
    setTitel(artikel.titel)
    setSamenvatting(artikel.samenvatting || '')
    setInhoud(artikel.inhoud)
    setCategorie(artikel.categorie_slug)
    setTags(artikel.tags?.join(', ') || '')
    setStatus(artikel.status)
    setMelding('')
  }, [artikel])

  const handleOpslaan = async () => {
    setOpslaan(true)
    setMelding('')
    try {
      await updateArtikel(artikel.id, {
        titel,
        samenvatting: samenvatting || null,
        inhoud,
        categorie_slug: categorie,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status: status as Artikel['status'],
      })
      setMelding('Opgeslagen!')
      onSaved()
    } catch (e) {
      setMelding('Fout bij opslaan: ' + (e instanceof Error ? e.message : 'onbekend'))
    }
    setOpslaan(false)
  }

  const handleArchiveer = async () => {
    if (!confirm('Weet je zeker dat je dit artikel wil archiveren?')) return
    try {
      await archiveerArtikel(artikel.id)
      setMelding('Gearchiveerd')
      onSaved()
    } catch (e) {
      setMelding('Fout: ' + (e instanceof Error ? e.message : 'onbekend'))
    }
  }

  const handlePubliceer = async () => {
    try {
      await publiceerArtikel(artikel.id)
      setMelding('Gepubliceerd!')
      onSaved()
    } catch (e) {
      setMelding('Fout: ' + (e instanceof Error ? e.message : 'onbekend'))
    }
  }

  const inp = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-[#1a1a2e] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6091]"

  return (
    <div className="w-1/2 bg-white dark:bg-[#252540] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 overflow-y-auto max-h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Artikel bewerken</h3>
        <div className="flex items-center gap-2">
          <a href={`/${artikel.categorie_slug}/${artikel.slug}`} target="_blank" className="text-xs text-[#1e6091] hover:underline">Bekijk live</a>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Titel</label>
          <input value={titel} onChange={e => setTitel(e.target.value)} className={inp} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categorie</label>
            <select value={categorie} onChange={e => setCategorie(e.target.value)} className={inp}>
              {Object.entries(categorieNamen).map(([slug, naam]) => (
                <option key={slug} value={slug}>{naam}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Artikel['status'])} className={inp}>
              <option value="concept">Concept</option>
              <option value="gepubliceerd">Gepubliceerd</option>
              <option value="gearchiveerd">Gearchiveerd</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Samenvatting (SEO, max 160 tekens)</label>
          <input value={samenvatting} onChange={e => setSamenvatting(e.target.value)} maxLength={160} className={inp} />
          <span className="text-[10px] text-gray-400">{samenvatting.length}/160</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tags (kommagescheiden)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="afval, milieu, oostende" className={inp} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Inhoud (Markdown)</label>
          <textarea value={inhoud} onChange={e => setInhoud(e.target.value)} rows={15} className={`${inp} font-mono text-xs leading-relaxed`} />
        </div>

        {melding && (
          <div className={`text-sm px-3 py-2 rounded ${melding.startsWith('Fout') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {melding}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={handleOpslaan} disabled={opslaan} className="flex-1 bg-[#1e6091] text-white py-2.5 rounded-lg font-medium hover:bg-[#174d73] transition-colors disabled:opacity-50 text-sm">
            {opslaan ? 'Opslaan...' : 'Opslaan'}
          </button>
          {artikel.status !== 'gepubliceerd' && (
            <button onClick={handlePubliceer} className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
              Publiceer
            </button>
          )}
          {artikel.status !== 'gearchiveerd' && (
            <button onClick={handleArchiveer} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm">
              Archiveer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function OpdrachtenTab({ opdrachten }: { opdrachten: Opdracht[] }) {
  return (
    <div className="bg-white dark:bg-[#252540] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a2e]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Titel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Categorie</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Prioriteit</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Aangemaakt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {opdrachten.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{o.titel}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{categorieNamen[o.categorie_slug || ''] || o.categorie_slug || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    o.prioriteit === 'hoog' ? 'bg-red-100 text-red-700' :
                    o.prioriteit === 'laag' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-700'
                  }`}>{o.prioriteit}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-gray-500">{formatDatum(o.created_at)}</td>
              </tr>
            ))}
            {opdrachten.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Nog geen opdrachten. De eerste nieuwscyclus moet nog draaien.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScansTab({ scans }: { scans: Scan[] }) {
  return (
    <div className="space-y-4">
      {scans.length === 0 && (
        <div className="bg-white dark:bg-[#252540] rounded-xl p-8 text-center text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700">
          Nog geen scans uitgevoerd. De eerste nieuwscyclus moet nog draaien.
        </div>
      )}
      {scans.map(s => (
        <div key={s.id} className="bg-white dark:bg-[#252540] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Scan {formatDatum(s.scan_datum)}</h3>
            <span className="text-sm text-gray-400">{s.aantal_opdrachten} opdrachten</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <span className="text-gray-400">Bronnen gescand:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">{s.bronnen_gescand?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-400">Geblokkeerd:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">{s.bronnen_geblokkeerd?.length || 0}</span>
            </div>
          </div>
          {s.rapport && (
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg p-3 whitespace-pre-wrap">
              {s.rapport}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function FeedbackTab({ feedback, artikelen, onUpdate }: { feedback: (Feedback & { artikel_titel?: string })[]; artikelen: Artikel[]; onUpdate: () => void }) {
  const artikelMap = new Map(artikelen.map(a => [a.id, a.titel]))

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateFeedbackStatus(id, status)
      onUpdate()
    } catch (e) {
      console.error('Fout bij status update:', e)
    }
  }

  return (
    <div className="bg-white dark:bg-[#252540] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a2e]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bericht</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Artikel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Datum</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {feedback.map(f => (
              <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{f.bericht}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{f.artikel_id ? artikelMap.get(f.artikel_id) || '-' : '-'}</td>
                <td className="px-4 py-3"><StatusBadge status={f.type} /></td>
                <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                <td className="px-4 py-3 text-gray-500">{formatDatum(f.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {f.status === 'nieuw' && (
                      <button onClick={() => handleStatus(f.id, 'in_behandeling')} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">Behandel</button>
                    )}
                    {f.status !== 'afgehandeld' && (
                      <button onClick={() => handleStatus(f.id, 'afgehandeld')} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">Klaar</button>
                    )}
                    {f.status !== 'afgewezen' && (
                      <button onClick={() => handleStatus(f.id, 'afgewezen')} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">Afwijzen</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {feedback.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Geen feedback ontvangen</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VragenTab({ vragen, artikelen, onUpdate }: { vragen: Vraag[]; artikelen: Artikel[]; onUpdate: () => void }) {
  const artikelMap = new Map(artikelen.map(a => [a.id, a.titel]))

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/vragen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      onUpdate()
    } catch (e) {
      console.error('Fout bij status update:', e)
    }
  }

  const vraagStatusKleuren: Record<string, string> = {
    nieuw: 'bg-blue-100 text-blue-800',
    in_behandeling: 'bg-yellow-100 text-yellow-800',
    beantwoord: 'bg-green-100 text-green-800',
    verworpen: 'bg-red-100 text-red-800',
    fout: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="bg-white dark:bg-[#252540] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#1a1a2e]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Vraag</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Naam</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Artikel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Reden</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Datum</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {vragen.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs">
                  <div className="truncate">{v.vraag}</div>
                  {v.antwoord && (
                    <div className="text-xs text-gray-400 mt-1 truncate">Antwoord: {v.antwoord.slice(0, 80)}...</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{v.naam || <span className="italic">anoniem</span>}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate text-xs">{v.artikel_id ? artikelMap.get(v.artikel_id) || '-' : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${vraagStatusKleuren[v.status] || 'bg-gray-100 text-gray-600'}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-[120px] truncate">{v.afgewezen_reden || '-'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDatum(v.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {v.status === 'nieuw' && (
                      <button onClick={() => handleStatus(v.id, 'verworpen')} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">Verwerp</button>
                    )}
                    {v.status === 'fout' && (
                      <button onClick={() => handleStatus(v.id, 'nieuw')} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">Opnieuw</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {vragen.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nog geen lezersvragen ontvangen</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
