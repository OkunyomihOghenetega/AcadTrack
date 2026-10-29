import {createContext, useContext, useState} from 'react'

const AuthContext = createContext()

function AuthProvider({children}){
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('acadTrackUser')
    return savedUser ? JSON.parse(savedUser):null
})

    function login(account){
        sessionStorage.setItem('acadTrackUser', JSON.stringify(account))
        
        setUser(account)
    }

    function logout() {
        sessionStorage.removeItem('acadTrackUser')

        setUser(null)
    }

    return(
        <AuthContext.Provider value ={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
  return useContext(AuthContext)
}

export {AuthProvider , useAuth}