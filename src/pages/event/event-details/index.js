import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import './index.css';
import { DEFAULT_EVENT_URL } from "../../../constants/common";

import useEvent from "../../../hooks/useEvent";
import AuthContext from "../../../context/authContext";

import Loader from "../../../components/loader";
import MapEvent from "../../../components/map-event";
import CustomComment from "../../../components/comment";

const EventDetails = () => {
	const { isAuthenticated, user } = useContext(AuthContext);
	const { eventId } = useParams();

	const {
		event,
		isLoading,
		isCreator,
		canSubscribe,
		comments,
		validationError,
		onClickAddEventHandler,
		onSubmitCommentHandler
	} = useEvent(eventId, isAuthenticated, user)

	const actionsAllowed = () => {
		if (!isAuthenticated) {
			return <Link className="join-link" to={'/register'}>JOIN US</Link>;
		}
		if (isCreator) {
			return <Link className="edit-link" to={`/events/${event.id}/edit`}>EDIT EVENT</Link>;
		}
		if ( canSubscribe) {
			return <Link className="add-to-event-list-link" to={`/events/${event.id}/subscribe`} onClick={onClickAddEventHandler} >ADD TO YOUR LIST</Link>;
		} else {
			if(event.status==="cancelled"){
				return <p className="added-to-event-list">CANCELLED EVENT</p>;
			}
			if(new Date(event.date)<Date.now()){
				return <p className="added-to-event-list">EXPIRED EVENT</p>;
			}
			return <p className="added-to-event-list">ADDED TO YOUR LIST</p>;
		}
	}

	if (isLoading) {
		return (
			<>
				<Loader />
			</>
		)
	}

	return (
		<>
			<h1>Event</h1>
			<div className="event-details-container">
				<div className="event-main">
					<h3 className="event-schedule">SCHEDULE: {event.date}</h3>
					<h3 className="event-heading"> TOPIC: {event.name}</h3>
					<div className="event-details">
						<span><i className="far fa-clock"></i>{event.createdAt}</span>
						<span><i className="far fa-user"></i>{event.creator}</span>
						<span><i className="far fa-comment-alt"></i>{comments.length}</span>
					</div>
					<div className="event-status">
						{event.status === 'active'
							? <span className="status-active" ><i className="fas fa-chart-line"></i>{event.status}</span>
							: <span className="status-cancelled"><i className="fas fa-ban"></i>{event.status}</span>
						}
					</div>
					<div className="event-image">
						<img src={event.imageUrl ? event.imageUrl :DEFAULT_EVENT_URL} alt="Event_cover" />
					</div>
					<p className="event-description">{event.description}</p>
					<div className="event-subscribed">
						{event.subscribed.length > 0
							? event.subscribed.map(x => <span key={x}> <i className="fas fa-user-circle subscribed"></i>{x}</span>)
							: <p>No one has subscribed yet...</p>
						}
					</div>
				</div>
				<div className="event-additional">
					<div className="event-map-container">
						{event.location && <MapEvent getGeoPoint={null} center={event.location} message={'Event location'} />}
					</div>
					<div className="event-comments">
						{comments.length > 0
							? comments.map(x => <CustomComment key={x.id} createdAt={x.createdAt} text={x.text} creator={x.creator} />)
							: <p>No comments yet... Be the first one to comment!</p>}
					</div>
					{isAuthenticated
						? <div className="event-comments-form">
							<form action="" method="post" onSubmit={onSubmitCommentHandler}>
								<h4>You can write your comment here:</h4>
								<textarea className="comment-input" name="comment" id="comment" cols="50" rows="6"></textarea>
								{validationError && <p className="comment-error">{validationError}</p>}
								<button className="comment-btn" type="submit">POST</button>
							</form>
						</div>
						: null
					}
				</div>
				<div className="event-actions">
					<div className="event-actions-icon">
						<i className="far fa-calendar-check"></i>
					</div>
					{actionsAllowed()}
				</div>
			</div>
		</>
	)
}

export default EventDetails;
