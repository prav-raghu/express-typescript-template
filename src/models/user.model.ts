export interface User {
    id: string;
    email: string;
    passwordHash: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    oauthAccounts?: OAuthAccount[];
    roles?: string[];
}

export interface OAuthAccount {
    provider: "google" | "microsoft" | "facebook";
    providerId: string;
    email: string;
}
