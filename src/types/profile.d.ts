export enum PremiumType {
    NONE = 'none',
    TRIAL = 'pro',
    PREMIUM = 'business',
}
export enum DeviceType {
    IOS = 'ios',
    ANDROID = 'android',
}

export interface Profile {
    id: string;
    is_premium: boolean;
    device_id?: string;
    premium_type?: PremiumType;
    push_notification_token?: string;
    device_type: DeviceType;

    // new params
    first_name?: string;
    last_name?: string;
    email?: string;
    push_notifications_enabled?: boolean;
    onboarding_completed: boolean, // default false
    lang: string; // default en
}
