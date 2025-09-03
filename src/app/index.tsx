import { Redirect } from 'expo-router';

export default function Index() {

    // const redirectUrl = '/playground'
    const redirectUrl = '/(onboarding)/welcome'

    const shouldRedirectToWelcome = () => {
        // Add your conditional logic here
        // For example: check if user is authenticated, has completed onboarding, etc.
        return true; // Currently always redirects to welcome
    };

    if (shouldRedirectToWelcome()) {
        return <Redirect href={redirectUrl} />;
    }

    // TODO: Add your main home screen content here when conditions are met
    return null;
}
