"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import { apiService } from "@/utils/apiService";
import { User } from "@/interfaces/user";

type UserContextType = {
    user: User | null;
    loading: boolean;
    setUser: Dispatch<SetStateAction<null>>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await apiService.getAxiosInstance().post('auth/me');
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!user) fetchUser().then();
    }, [user]); // Prevents re-fetching if the user exists

    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context : UserContextType | null = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}
