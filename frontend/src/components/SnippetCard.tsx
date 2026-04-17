'use client';

import Link from 'next/link';
import { Snippet } from '@/lib/types';

interface Props {
  snippet: Snippet;
}

const typeBadge: Record<string, string> = {
  link: 'bg-blue-950 text-blue-300 border border-blue-800',
  note: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
  command: 'bg-orange-950 text-orange-300 border border-orange-800',
};

export default function SnippetCard({ snippet }: Props) {
  const preview =
    snippet.content.length > 120 ? snippet.content.slice(0, 120) + '…' : snippet.content;

  return (
    <Link href={`/snippets/${snippet._id}`}>
      <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-violet-700 hover:bg-zinc-800/60 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors leading-tight">
            {snippet.title}
          </h3>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${typeBadge[snippet.type] ?? ''}`}>
            {snippet.type}
          </span>
        </div>

        <p className="text-zinc-400 text-sm font-mono whitespace-pre-wrap break-all mb-4 leading-relaxed">
          {preview}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="bg-violet-950 text-violet-300 border border-violet-800 text-xs px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-zinc-600 text-xs shrink-0">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
