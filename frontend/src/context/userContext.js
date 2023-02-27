import { createContext, useState } from "react";
import axios from 'axios';

export const userContext = createContext(null);

export const UserProvider = ({children}) => {

    const [user, setUser] = useState({});

    const logout = async () => {
        await axios.post("/logout", { withCredentials: true,
        credentials: "include"});
        setUser({})
    }

    const isLoggedIn = () => {
        return user?._id && !user?.isGuest ? true : false
    }

    const isGuest = () => {
        return user?._id && user?.isGuest ? true : false
    }


    return <userContext.Provider value={{user, setUser, logout, isLoggedIn, isGuest}}>
        {children}
    </userContext.Provider>
}