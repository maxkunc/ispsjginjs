import { ApiError } from '../api/client.js'

// Maps a backend error code (ApiError.message) to an i18n key.
const CODE_TO_I18N_KEY = {
  invalid_credentials: 'errorInvalidCredentials',
  missing_credentials: 'errorMissing',
  upstream_error: 'errorUpstream',
  ssl_error: 'errorUpstream',
  connection_error: 'errorConnection',
  not_authenticated: 'errorUnknown',
}

export function errorToI18nKey(err) {
  const code = err instanceof ApiError ? err.message : null
  return CODE_TO_I18N_KEY[code] ?? 'errorUnknown'
}
