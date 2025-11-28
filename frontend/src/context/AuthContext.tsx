import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type AuthUser, type LoginCredentials, login as apiLogin, getMe } from '../api/auth';
import { registerFcmToken, removeFcmToken } from '../api/notifications';
import { getFcmToken, deleteFcmToken, isNotificationSupported } from '../lib/firebase';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    requestPushNotifications: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'gymly_token';
const FCM_TOKEN_KEY = 'gymly_fcm_token';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(async () => {
        const storedFcmToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (storedFcmToken) {
            try {
                await removeFcmToken(storedFcmToken);
                await deleteFcmToken();
            } catch (error) {
                console.error('Error removing FCM token:', error);
            }
            localStorage.removeItem(FCM_TOKEN_KEY);
        }

        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const registerPushNotifications = useCallback(async (): Promise<boolean> => {
        if (!isNotificationSupported()) {
            console.warn('Push notifications not supported');
            return false;
        }

        try {
            const fcmToken = await getFcmToken();
            if (fcmToken) {
                await registerFcmToken({
                    token: fcmToken,
                    platform: 'web',
                    deviceId: navigator.userAgent,
                });
                localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
                console.log('FCM token registered successfully');
                return true;
            }
        } catch (error) {
            console.error('Error registering FCM token:', error);
        }
        return false;
    }, []);

    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await getMe(token);
                setUser(userData);

                const storedFcmToken = localStorage.getItem(FCM_TOKEN_KEY);
                if (!storedFcmToken) {
                    registerPushNotifications().catch(console.error);
                }
            } catch {
                logout();
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [token, logout, registerPushNotifications]);

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            const response = await apiLogin(credentials);
            localStorage.setItem(TOKEN_KEY, response.accessToken);
            setToken(response.accessToken);
            setUser(response.user);

            registerPushNotifications().catch(console.error);
        },
        [registerPushNotifications],
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                requestPushNotifications: registerPushNotifications,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
