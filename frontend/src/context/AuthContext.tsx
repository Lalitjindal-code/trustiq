'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        // Strip Firebase SDK and external auth iframe loading from the initial render bundle
        // by deferring the execution until the component mounts.
        Promise.all([
            import('@/lib/firebase'),
            import('firebase/auth')
        ]).then(([{ auth }, { onAuthStateChanged }]) => {
            unsubscribe = onAuthStateChanged(auth, (usr) => {
                setUser(usr);
                setLoading(false);
            });
        }).catch((err) => {
            console.error("Failed to lazily initialize Firebase Auth", err);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const logout = async () => {
        const [{ auth }, { signOut }] = await Promise.all([
            import('@/lib/firebase'),
            import('firebase/auth')
        ]);
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
