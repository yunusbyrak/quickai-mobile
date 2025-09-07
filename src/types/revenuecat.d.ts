// Types for RevenueCat and Supabase
export interface RevenueCatCustomer {
    id: string; // $RCAnonymousID:... or RevenueCat UserID
    latest_expiration: string | null;
    original_app_user_id: string | null;
    entitlements: Record<string, any> | null;
    subscriptions: Record<string, any> | null;
    all_purchased_products: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string | null;
    is_paid: boolean;
    is_premium: boolean;
    revenuecat_id: string | null;
    created_at: string;
    language: string;
}

// Types for raw RevenueCat data
export interface RevenueCatEntitlement {
    identifier: string;
    isActive: boolean;
    willRenew: boolean;
    periodType: string;
    latestPurchaseDate: string;
    originalPurchaseDate: string;
    expirationDate: string | null;
    store: string;
    productIdentifier: string;
    isSandbox: boolean;
    unsubscribeDetectedAt: string | null;
    billingIssuesDetectedAt: string | null;
}

export interface RevenueCatSubscription {
    billingIssuesDetectedAt: string | null;
    expiresDate: string;
    gracePeriodExpiresDate: string | null;
    isActive: boolean;
    isSandbox: boolean;
    originalPurchaseDate: string;
    ownershipType: string;
    periodType: string;
    price: Record<string, any>;
    productIdentifier: string;
    purchaseDate: string;
    refundedAt: string | null;
    store: string;
    storeTransactionId: string;
    unsubscribeDetectedAt: string | null;
    willRenew: boolean;
}

export interface RevenueCatCustomerInfo {
    activeSubscriptions: string[];
    allExpirationDates: Record<string, string>;
    allExpirationDatesMillis: Record<string, number>;
    allPurchaseDates: Record<string, string>;
    allPurchaseDatesMillis: Record<string, number>;
    allPurchasedProductIdentifiers: string[];
    entitlements: {
        active: Record<string, RevenueCatEntitlement>;
        all: Record<string, RevenueCatEntitlement>;
        verification: string;
    };
    firstSeen: string;
    firstSeenMillis: number;
    latestExpirationDate: string | null;
    latestExpirationDateMillis: number | null;
    managementURL: string | null;
    nonSubscriptionTransactions: any[];
    originalAppUserId: string;
    originalApplicationVersion: string | null;
    originalPurchaseDate: string | null;
    originalPurchaseDateMillis: number | null;
    requestDate: string;
    requestDateMillis: number;
    subscriptionsByProductIdentifier: Record<string, RevenueCatSubscription>;
}

// Types for hooks
export interface PremiumStatus {
    isPremium: boolean;
    loading: boolean;
    error: string | null;
    customerInfo: RevenueCatCustomerInfo | null;
    refetch: () => Promise<void>;
}

export interface RevenueCatContextType {
    isPro: boolean;
    isReady: boolean;
    customerInfo: RevenueCatCustomerInfo | null;
    updateCustomerInfo: (customerInfo: RevenueCatCustomerInfo) => Promise<void>;
    refetchCustomerInfo: () => Promise<void>;
}
