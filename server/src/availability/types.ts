import type { Types } from 'mongoose';
import type { ConnectionType, IHomeTariff } from '../models/internet/home-tariff';

export interface Address {
    postcode: string;
    street: string;
    houseNumber: string;
}

// What a client sends; checked and cleaned by normalizeAddress
export interface RawAddress {
    postcode?: unknown;
    street?: unknown;
    houseNumber?: unknown;
}

export interface Connection {
    connectionType: ConnectionType;
    maxDownloadMbps: number;
}

export interface ProviderAvailability {
    providerId: Types.ObjectId;
    provider: string;
    source: string;
    connections: Connection[];
}

export type AdapterOffer = Pick<IHomeTariff, 'providerId' | 'connectionType' | 'downloadMbps' | 'coverage'>;

// Answers "which connections does this provider offer at this address?" ([] = not available)
export interface AvailabilityAdapter {
    source: string;
    check(address: Address, provider: { slug: string }, offers: AdapterOffer[]): Promise<Connection[]>;
}
