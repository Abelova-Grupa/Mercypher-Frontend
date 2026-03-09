export class EncryptionService {
    private static instance: EncryptionService;
    private myKeyPair: CryptoKeyPair | null = null;
    // Stores derived AES keys indexed by the person you are talking to
    private sharedKeys: Record<string, CryptoKey> = {};

    private constructor() { }

    public static getInstance(): EncryptionService {
        if (!EncryptionService.instance) {
            EncryptionService.instance = new EncryptionService();
        }
        return EncryptionService.instance;
    }

    /**
     * Creates a public/private pair
     */
    public async generateIdentityKeys(): Promise<string> {
        this.myKeyPair = await window.crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" },
            true,
            ["deriveKey"]
        );

        // Export public key to Base64 so you can send it to the other user
        const exported = await window.crypto.subtle.exportKey("spki", this.myKeyPair.publicKey);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }

    /**
     * Takes the other person's public key and your private key to create 
     * a single shared AES key for the whole conversation.
     */
    public async establishSharedKey(peerPublicKeyB64: string, peerId: string): Promise<void> {
        if (!this.myKeyPair) throw new Error("Local keys not generated");

        // Import the peer's string key back into a CryptoKey object
        const binaryDer = Uint8Array.from(atob(peerPublicKeyB64), c => c.charCodeAt(0));
        const peerPublicKey = await window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            { name: "ECDH", namedCurve: "P-256" },
            false,
            []
        );

        // Derive the shared AES-GCM key
        this.sharedKeys[peerId] = await window.crypto.subtle.deriveKey(
            { name: "ECDH", public: peerPublicKey },
            this.myKeyPair.privateKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        console.log(`Encryption channel established with ${peerId}`);
    }

    /**
     * Uses AES-GCM. Generates a unique IV for every message.
     */
    public async encrypt(plainText: string, peerId: string): Promise<string> {
        const key = this.sharedKeys[peerId];
        if (!key) return plainText; // Fallback if no key established

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(plainText);

        const encryptedContent = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encodedText
        );

        // We must store the IV along with the message to decrypt it later
        const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedContent), iv.length);

        return btoa(String.fromCharCode(...combined));
    }

    /**
     * 4. DECRYPT MESSAGE
     */
    public async decrypt(cipherTextB64: string, peerId: string): Promise<string> {
        const key = this.sharedKeys[peerId];
        if (!key) return cipherTextB64;

        try {
            const combined = Uint8Array.from(atob(cipherTextB64), c => c.charCodeAt(0));
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );

            return new TextDecoder().decode(decryptedContent);
        } catch (e) {
            console.error("Decryption failed", e);
            return "[Encrypted Message]";
        }
    }
    /**
    * Creates a random 256-bit AES key for the group.
    * This should be called by the group creator.
    */
    public async generateGroupKey(): Promise<CryptoKey> {
        return await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Encrypts the Group Key specifically for one user using your shared DH secret.
     */
    public async wrapGroupKey(groupKey: CryptoKey, peerId: string): Promise<string> {
        const sharedKey = this.sharedKeys[peerId];
        if (!sharedKey) throw new Error(`No DH session established with ${peerId}`);

        // Export the raw group key bytes
        const exportedGroupKey = await window.crypto.subtle.exportKey("raw", groupKey);

        // Encrypt the group key using the shared DH key
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            sharedKey,
            exportedGroupKey
        );

        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return btoa(String.fromCharCode(...combined));
    }

    /**
     * Decrypts a Group Key sent to you by another member.
     */
    public async unwrapGroupKey(wrappedKeyB64: string, senderId: string, groupId: string): Promise<void> {
        const sharedKey = this.sharedKeys[senderId];
        if (!sharedKey) throw new Error(`No DH session with sender ${senderId}`);

        const combined = Uint8Array.from(atob(wrappedKeyB64), c => c.charCodeAt(0));
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);

        const decryptedRawKey = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            sharedKey,
            data
        );

        // Import the raw bytes back as an AES-GCM key for this group
        this.sharedKeys[groupId] = await window.crypto.subtle.importKey(
            "raw",
            decryptedRawKey,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    }
}