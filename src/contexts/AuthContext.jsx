// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Auth state: simpan token, role, nama, dst di sini (bisa extend sesuai kebutuhan)
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        token: null,
        user: null,    // { name: "...", role: "...", dst }
    });

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, [])

    // Fungsi login & logout
    const login = (token, user) => {
        const authData = {
            isLoggedIn: true,
            token,
            user,
        }
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    };

    const logout = () => {
        setAuth({isLoggedIn: false, token: null, user: null});
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);