/**
 * API接続設定
 * 環境変数からURLを取得し、ローカル/本番を自動切り替え
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * APIリクエストのベース関数
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

/**
 * ヘルスチェック
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchApi('/health')
}
