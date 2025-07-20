import { canonicalizeAndHash } from './jsonCanonicalizer.js';
import { hmacSha256Base64 } from './hmac.js';

export async function generateSignature({ method, urlPath, query, timestamp, nonce, body, secret }) {
    const canonicalQuery = Object.entries(query)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
        .join('&');

    const pathAndQuery = urlPath + (canonicalQuery ? `?${canonicalQuery}` : '');
    const bodyHash = await canonicalizeAndHash(body);

    const raw = `${method.toUpperCase()}${pathAndQuery}${timestamp}${nonce}${bodyHash}`;
    return await hmacSha256Base64(secret, raw);
}