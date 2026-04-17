import { Snippet, SnippetFormData, PaginatedResponse } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message ?? res.statusText), { status: res.status });
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  list(params: { page?: number; limit?: number; q?: string; tag?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.q) qs.set('q', params.q);
    if (params.tag) qs.set('tag', params.tag);
    return request<PaginatedResponse>(`/snippets?${qs}`);
  },
  get: (id: string) => request<Snippet>(`/snippets/${id}`),
  create: (data: SnippetFormData) =>
    request<Snippet>('/snippets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<SnippetFormData>) =>
    request<Snippet>(`/snippets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/snippets/${id}`, { method: 'DELETE' }),
};
