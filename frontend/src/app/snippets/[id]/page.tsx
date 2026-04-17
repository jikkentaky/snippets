'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Snippet } from '@/lib/types';
import SnippetForm from '@/components/SnippetForm';
import ConfirmDialog from '@/components/ConfirmDialog';

const typeConfig: Record<string, { badge: string; icon: string }> = {
  link:    { badge: 'bg-blue-950 text-blue-300 border border-blue-800',         icon: '🔗' },
  note:    { badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800', icon: '📝' },
  command: { badge: 'bg-orange-950 text-orange-300 border border-orange-800',    icon: '⚡' },
};

export default function SnippetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(id)
      .then(setSnippet)
      .catch((e) => setError(e.message ?? 'Failed to load snippet'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(id);
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  async function handleCopy() {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (error && !snippet) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-6 inline-block transition-colors">
          ← Back to list
        </Link>
        <div className="rounded-xl bg-red-950/40 border border-red-800 text-red-300 px-5 py-4">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!snippet) return null;

  const cfg = typeConfig[snippet.type] ?? { badge: '', icon: '' };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-6 inline-block transition-colors">
        ← Back to list
      </Link>

      {error && (
        <div className="rounded-xl bg-red-950/40 border border-red-800 text-red-300 px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-5">Edit Snippet</h2>
          <SnippetForm
            initialData={snippet}
            onSubmit={async (fd) => {
              const updated = await api.update(id, fd);
              setSnippet(updated);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-zinc-100 leading-tight">{snippet.title}</h1>
            <span className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
              <span>{cfg.icon}</span>
              {snippet.type}
            </span>
          </div>

          <div className="relative mb-4 group/code">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 overflow-auto whitespace-pre-wrap break-all leading-relaxed font-mono">
              {snippet.content}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-all opacity-0 group-hover/code:opacity-100"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {snippet.tags.map((t) => (
                <span
                  key={t}
                  className="bg-violet-950 text-violet-300 border border-violet-800 text-xs px-2.5 py-1 rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-600 min-w-0">
              Created {new Date(snippet.createdAt).toLocaleString()}
              {snippet.updatedAt !== snippet.createdAt && (
                <> · Updated {new Date(snippet.updatedAt).toLocaleString()}</>
              )}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm transition-colors border border-zinc-700"
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-300 text-sm transition-colors border border-red-800 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        message="Delete this snippet? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </main>
  );
}
