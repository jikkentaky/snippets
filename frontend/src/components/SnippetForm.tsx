'use client';

import { useState } from 'react';
import { SnippetFormData, SnippetType } from '@/lib/types';

interface Props {
  initialData?: { title: string; content: string; type: SnippetType; tags: string[] };
  onSubmit: (data: SnippetFormData) => Promise<void>;
  onCancel: () => void;
}

const TYPES: SnippetType[] = ['link', 'note', 'command'];

const inputClass =
  'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors';

export default function SnippetForm({ initialData, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [type, setType] = useState<SnippetType>(initialData?.type ?? 'note');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        type,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (e) {
      setErrors({ submit: e instanceof Error ? e.message : 'Submit failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Useful git command"
          className={inputClass}
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Paste your snippet here…"
          className={`${inputClass} font-mono resize-none`}
        />
        {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as SnippetType)}
          className={inputClass}
        >
          {TYPES.map((t) => (
            <option key={t} value={t} className="bg-zinc-800">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Tags{' '}
          <span className="text-zinc-500 font-normal text-xs">(comma-separated)</span>
        </label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="bash, linux, devops"
          className={inputClass}
        />
      </div>

      {errors.submit && (
        <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
          {errors.submit}
        </p>
      )}

      <div className="flex gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
