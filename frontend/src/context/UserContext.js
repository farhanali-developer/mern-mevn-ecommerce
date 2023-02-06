import {createContext, useState} from 'react'

export const UserContext = createContext();

const initialValues = {
    name: "Farhan",
    age: "26",
    dob: "01-01-2000"
}

const emptyValues = {}

export const UserProvider = ({children}) => {


    const [user, setUser] = useState(initialValues)

    const logout = () => {
        setUser(emptyValues)
    }

    console.log(children)

    return(
        <UserContext.Provider value={{user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    )
}

