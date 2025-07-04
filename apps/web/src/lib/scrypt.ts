import pkg from "scrypt-js";
const { scrypt } = pkg;

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return arr;
}

export async function deriveScryptKey(
  password: string,
  saltHex: string,
  keyLength: number = 32 // 32 bytes = 256 bits for AES-256
): Promise<Uint8Array> {
  const salt = hexToUint8Array(saltHex);
  const passwordBytes = new TextEncoder().encode(password);

  // scrypt parameters: N, r, p
  const N = 2 ** 15; // 32768 (reasonable for browsers, increase if possible)
  const r = 8;
  const p = 1;

  const key = await scrypt(passwordBytes, salt, N, r, p, keyLength);
  return key;
}
