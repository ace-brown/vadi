// Types shared across the server

export type OfferKind = 'home' | 'mobile';

export interface UserData {
    userId: string;
    // Only set by optional-auth
    role?: string;
}

// Express's Request gets the logged-in user from check-auth / optional-auth
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            userData?: UserData;
        }
    }
}
