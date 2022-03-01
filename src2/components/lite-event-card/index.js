import { Link } from 'react-router-dom';

import './index.css';
import { DEFAULT_EVENT_URL } from '../../common';

const EventCardLite = ({onClickSignoutEvent, eventId, imageUrl, name, date, status}) => {
   
    return (
        <div className="event-card-lite">
            <span className="event-card-lite-img">
                <img src={imageUrl ? imageUrl :DEFAULT_EVENT_URL} alt="event_cover" />
            </span>
            <div className="event-card-lite-content">
                <div className="event-card-lite-content-text">
                    <p><span className="event-card-lite-content-heading">Status: </span>{status}</p>
                    <p> <span className="event-card-lite-content-heading date"> Date: </span>{date}</p>
                    <p><span className="event-card-lite-content-heading" >Topic: </span>{name}</p>
                </div>
                <div className="book-card-lite-content-actions">
                <Link className="details-link-lite" to={`/events/${eventId}`}>VIEW</Link>
                <span className='slash-span'>&#47;</span>
                <Link className="delete-link-lite" to={`/my-page/${eventId}/event-remove/${eventId}`} onClick={onClickSignoutEvent}>SIGNOUT</Link>
                </div>
            </div>
        </div>
    )
}

export default EventCardLite;