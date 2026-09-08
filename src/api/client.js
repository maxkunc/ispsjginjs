// Talks to the OpenSchoolSucks Flask JSON API (/api/*). The backend keeps the
// actual is.psjg.cz session server-side, so every request just needs to carry
// the session cookie back and forth.
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // No JSON body (e.g. a network-level failure) - fall through, handled below.
  }

  if (!response.ok || (payload && payload.ok === false)) {
    throw new ApiError(payload?.error || `request_failed_${response.status}`, {
      status: response.status,
      code: payload?.code,
    })
  }

  return payload
}

export const api = {
  session: () => request('/session'),
  login: (username, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/logout', { method: 'POST' }),
  home: (page = 1) => request(`/home?page=${page}`),
  setSemester: (semester) =>
    request('/semester', { method: 'POST', body: JSON.stringify({ semester }) }),
  subject: (id) => request(`/subject/${id}`),
  portfolio: () => request('/portfolio'),
  zkouseni: () => request('/zkouseni'),
}

export { ApiError }
