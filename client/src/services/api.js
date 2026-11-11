const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

function getErrorMessage(error, status) {
  if (typeof error === 'string' && error.trim()) return error

  if (error && typeof error === 'object') {
    if (typeof error.message === 'string' && error.message.trim()) return error.message
    if (Array.isArray(error.issues)) {
      const messages = error.issues
        .map((issue) => issue?.message)
        .filter((message) => typeof message === 'string' && message.trim())
      if (messages.length) return messages.join(' ')
    }

    const formattedMessages = []
    function collectFormattedMessages(value) {
      if (!value || typeof value !== 'object') return
      if (Array.isArray(value._errors)) {
        formattedMessages.push(...value._errors.filter((message) => typeof message === 'string' && message.trim()))
      }
      for (const [key, nestedValue] of Object.entries(value)) {
        if (key !== '_errors') collectFormattedMessages(nestedValue)
      }
    }
    collectFormattedMessages(error)
    if (formattedMessages.length) return [...new Set(formattedMessages)].join(' ')
  }

  return `Request failed (${status})`
}

export async function requestJson(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const { headers: extraHeaders = {}, ...requestOptions } = options

  const response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...extraHeaders,
    },
    ...requestOptions,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = getErrorMessage(payload?.error, response.status)
    throw new Error(message)
  }

  return payload
}

export async function getHealth() {
  return requestJson('/health')
}

export function resolveMediaUrl(path) {
  if (typeof path === 'string' && path.startsWith('/uploads/media/')) {
    return new URL(path, apiBaseUrl).toString()
  }
  return path
}

export { apiBaseUrl }
