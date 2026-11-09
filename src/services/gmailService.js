// Gmail API service using Google Identity Services (GIS)
// Uses only the Client ID — safe to include in frontend code.
// The Client Secret is NEVER used here (server-side only).

const CLIENT_ID = '738171362050-q0q8k27kijcl5foagaf0naumdfof7mcm.apps.googleusercontent.com'
const SCOPES = 'https://www.googleapis.com/auth/gmail.send'

let tokenClient = null
let accessToken = null
let tokenExpiry = null

/**
 * Load the Google Identity Services script dynamically.
 */
function loadGISScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve()
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

/**
 * Initialise the token client (call once on first use).
 */
async function initTokenClient(onSuccess, onError) {
  await loadGISScript()
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        onError(new Error(response.error))
        return
      }
      accessToken = response.access_token
      // tokens expire after 3600s — store expiry
      tokenExpiry = Date.now() + (response.expires_in - 60) * 1000
      onSuccess(accessToken)
    },
  })
}

/**
 * Request an access token. Shows the Google consent popup.
 * Returns a promise that resolves with the token.
 */
export function requestGmailAccess() {
  return new Promise(async (resolve, reject) => {
    try {
      await initTokenClient(resolve, reject)
      tokenClient.requestAccessToken({ prompt: 'consent' })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Get a valid access token, requesting one if needed.
 */
export async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }
  return requestGmailAccess()
}

/**
 * Encode an email to RFC 2822 base64url format required by Gmail API.
 */
function encodeEmail({ to, subject, body, fromName }) {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(body))),
  ]
  const raw = emailLines.join('\r\n')
  // base64url encode
  return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Send an email via the Gmail API.
 * @param {Object} param0 - { to, subject, body, fromName }
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendGmail({ to, subject, body, fromName = 'Ramaiah Capital' }) {
  try {
    const token = await getAccessToken()
    const raw = encodeEmail({ to, subject, body, fromName })

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || 'Gmail API error')
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (error) {
    // If token expired mid-session, clear and let caller retry
    if (error.message?.includes('invalid_grant') || error.message?.includes('401')) {
      accessToken = null
      tokenExpiry = null
    }
    return { success: false, error: error.message }
  }
}

/**
 * Check if the user has already authorised Gmail in this session.
 */
export function isGmailAuthorised() {
  return !!(accessToken && tokenExpiry && Date.now() < tokenExpiry)
}

/**
 * Revoke the current token (sign out of Gmail).
 */
export function revokeGmailAccess() {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken)
  }
  accessToken = null
  tokenExpiry = null
}
