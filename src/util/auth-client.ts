import { authClient } from "../lib/auth-client";

export const signUp = async ({
    email,
    password,
    name,
    image
}: {
    email: string;
    password: string;
    name: string;
    image?: string;
}) => {
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image
    });
    return { data, error };
};

export const signIn = async ({
    email,
    password,
    rememberMe = true
}: {
    email: string;
    password: string;
    rememberMe?: boolean;
}) => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: `/welcome`,
    });
    return { data, error };
};

export const signInWithGithub = async () => {
    return await authClient.signIn.social({
        provider: "github",
        callbackURL: `/dashboard`,
        newUserCallbackURL: `/welcome`,
        errorCallbackURL: `/auth/error`,
    });
};

export const signOut = async () => {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                window.location.href = "/sign-in";
            },
        },
    });
};

export const sendVerificationEmail = async (email: string) => {
    return await authClient.sendVerificationEmail({
        email,
        callbackURL: "/auth/verify-success",
    });
};

export const forgotPassword = async (email: string) => {
    return await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
    });
};

export const resetPassword = async (token: string, newPassword: string) => {
    return await authClient.resetPassword({
        token,
        newPassword: newPassword,
    });
};

export const useSession = () => {
    return authClient.useSession();
};