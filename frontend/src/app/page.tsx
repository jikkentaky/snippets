'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { PaginatedResponse } from '@/lib/types';
import SnippetCard from '@/components/SnippetCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import SnippetForm from '@/components/SnippetForm';

export default function HomePage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.list({ page, limit: 10, q: q || undefined, tag: tag || undefined });
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load snippets');
    } finally {
      setLoading(false);
    }
  }, [page, q, tag]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  useEffect(() => {
    setPage(1);
  }, [q, tag]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Snippet Vault</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your personal collection of code snippets, links &amp; notes
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> New Snippet
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <SearchBar value={q} onChange={setQ} />
        <TagFilter value={tag} onChange={setTag} />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading snippets…</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-red-950/40 border border-red-800 text-red-300 px-5 py-4">
          <p className="font-medium text-sm">Failed to load snippets</p>
          <p className="text-xs text-red-400 mt-0.5">{error}</p>
        </div>
      )}

      {!loading && !error && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-zinc-300 font-medium mb-1">
            {q || tag ? 'No snippets match your search' : 'No snippets yet'}
          </p>
          <p className="text-zinc-600 text-sm">
            {q || tag
              ? 'Try different keywords or clear the filters'
              : 'Click "+ New Snippet" to add your first one'}
          </p>
        </div>
      )}

      {!loading && !error && data && data.data.length > 0 && (
        <>
          <p className="text-zinc-600 text-xs mb-3">
            {data.total} snippet{data.total !== 1 ? 's' : ''}
            {q && ` for "${q}"`}
            {tag && ` tagged #${tag}`}
          </p>
          <div className="flex flex-col gap-3">
            {data.data.map((s) => (
              <SnippetCard key={s._id} snippet={s} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
          )}
        </>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Snippet">
        <SnippetForm
          onSubmit={async (fd) => {
            await api.create(fd);
            setShowCreate(false);
            fetchSnippets();
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </main>
  );
}
