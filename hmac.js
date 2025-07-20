export async function hmacSha256Base64(secret, data) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    return bufferToBase64(signature);
}

function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
}