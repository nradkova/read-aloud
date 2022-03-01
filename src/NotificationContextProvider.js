import { useState,useCallback } from 'react';

import { INITIAL_NOTIFICATION_VALUE } from './constants/common';

import NotificationContext from './context/notificationContext';


const NotificationContextProvider = ({children}) => {

    const [notification, setNotification] = useState(INITIAL_NOTIFICATION_VALUE);

    const showNotification = useCallback((message,objectId) => {
        setNotification(prev=>({...prev, show: true, message,objectId}));

        setTimeout(() => {
            setNotification(INITIAL_NOTIFICATION_VALUE);
        }, 5000);
    }, []);

    const handleNotification = (result) => {
        if(result==='cancel'){
            setNotification(INITIAL_NOTIFICATION_VALUE);
        }
        setNotification(prev=>({...prev,result}));
    };

    return (
        <NotificationContext.Provider
            value={{ notification, showNotification, handleNotification} }>
            { children }
        </NotificationContext.Provider>
    )
};

export default NotificationContextProvider;
