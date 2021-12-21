import { Link } from 'react-router-dom';

import './index.css';
import { DEFAULT_EVENT_URL } from '../../common';

const EventCardMedium = ({ id, imageUrl, name, date, status,createdAt }) => {
   
    return (
        <div className="event-card-medium">
            <span className="event-card-medium-img">
                <img src={imageUrl ? imageUrl :DEFAULT_EVENT_URL} alt="event_cover" />
            </span>
            <div className="event-card-medium-content">
                <Link className="details-link" to={`/events/${id}`}>VIEW</Link>
                <div className="event-card-medium-content-text">
                    <p><span className="event-card-medium-content-heading" >Topic: </span>{name}</p>
                    <p> <span className="event-card-medium-content-heading date"> Date: </span>{date}</p>
                    <p><span className="event-card-medium-content-heading">Status: </span>{status}</p>
                    <p className='date-post' > <span className="event-card-medium-content-heading date-post"> Posted on: </span>{createdAt}</p>
                </div>
            </div>
        </div>
    )
}

export default EventCardMedium;