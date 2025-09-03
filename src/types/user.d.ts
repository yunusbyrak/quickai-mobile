export enum PremiumType {
    NONE = 'none',
    TRIAL = 'pro',
    PREMIUM = 'business',
}
export enum DeviceType {
    IOS = 'ios',
    ANDROID = 'android',
}

export interface User {
    id: string;
    is_premium: boolean;
    device_id?: string;
    premium_type?: PremiumType;
    push_notification_token?: string;
    device_type: DeviceType;
}
