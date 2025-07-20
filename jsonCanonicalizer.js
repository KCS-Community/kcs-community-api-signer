export async function canonicalizeAndHash(json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch {
        return '';
    }

    const sorted = sortJson(parsed);
    const canonicalJson = JSON.stringify(sorted);
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalJson);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToBase64(hashBuffer);
}

function sortJson(input) {
    if (Array.isArray(input)) return input.map(sortJson);
    if (input !== null && typeof input === 'object') {
        return Object.keys(input)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortJson(input[key]);
                return acc;
            }, {});
    }
    return input;
}

function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
}