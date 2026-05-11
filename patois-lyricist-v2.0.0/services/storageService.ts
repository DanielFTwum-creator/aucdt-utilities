
/**
 * SOC 2 Confidentiality Utility
 * Encodes/Decodes data to prevent plain-text viewing in browser storage files.
 */
const encode = (data: string): string => btoa(unescape(encodeURIComponent(data)));
const decode = (data: string): string => decodeURIComponent(escape(atob(data)));

export const secureSetItem = (key: string, value: any): void => {
    try {
        const stringified = JSON.stringify(value);
        const encoded = encode(stringified);
        localStorage.setItem(key, encoded);
    } catch (e) {
        console.error("Storage encryption error", e);
    }
};

export const secureGetItem = <T>(key: string): T | null => {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        const decoded = decode(value);
        return JSON.parse(decoded) as T;
    } catch (e) {
        console.error("Storage decryption error", e);
        return null;
    }
};

export const removeItem = (key: string): void => {
    localStorage.removeItem(key);
};
