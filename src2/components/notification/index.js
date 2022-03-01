import { useContext } from 'react';

import './index.css';

import NotificationContext from '../../context/notificationContext';

const Notification = () => {
  const { notification, handleNotification } = useContext(NotificationContext);

  if(!notification.show){
    return null;
  }

  return (
    <div className="notification-message">
      <p className="notification-message-text">{notification.message}</p>
      <div className="notification-message-buttons">
        <button onClick={()=>handleNotification("confirm")} className="confirm">CONFIRM</button>
        <button onClick={()=>handleNotification("cancel")} className="cancel">CANCEL</button>
      </div>
    </div>
  )
}

export default Notification;