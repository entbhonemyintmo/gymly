import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type AuthUser, type LoginCredentials, login as apiLogin, getMe } from '../api/auth';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'gymly_token';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
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
            } catch {
                logout();
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [token, logout]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await apiLogin(credentials);
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
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
