import { INITIAL_AUTH_VALUE } from './constants/common';

import AuthContext from './context/authContext';
import useLocalStorage from './hooks/useLocalStorage';

const AuthContextProvider = (props) => {

    const [user, setUser] = useLocalStorage('user', INITIAL_AUTH_VALUE);
    
    const login = (authData) => {
        setUser(authData);
    }

    const logout = () => {
        setUser(INITIAL_AUTH_VALUE);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: user.username
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
