import { useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import './index.css';

import AuthContext from "../../../context/authContext";
import useEventForm from "../../../hooks/useEventForm";

import Loader from "../../../components/loader";
import MapEvent from "../../../components/map-event";
import ValidationError from "../../../components/validation-error";

const EventEdit = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const { eventId } = useParams();

	const {
		eventValue: event,
		notCreator,
		isLoading,
		isImageLoading,
		validationError,
		imagePreview,
		isSuccess,
		getGeoPoint,
		onChangeImageHandler,
		onChangeInputHandler,
		onSubmitEventEditHandler,
		setInitialEventEditValue,
		onClickCancelEventHandler,
	} = useEventForm(user);
	
	useEffect(() => {
		if (isSuccess) {
			navigate('/events');
		}
	}, [isSuccess, navigate])
	
	
	useEffect(() => {
		setInitialEventEditValue(eventId);
	}, [eventId])

	useEffect(() => {
		if(notCreator){
			navigate('/home');
		}
	}, [notCreator,navigate])
	

	if (isLoading) {
		return (
			<>
				<Loader />
			</>
		)
	}
	
	return (
		<>
			<div className="event-form-container">
				<div className="event-form-title">
					<h3><i className="fa fa-arrow-right"></i>Edit event</h3>
				</div>
				<form className="event-form-body" onSubmit={onSubmitEventEditHandler}>
					<div className="event-form-body-main">
						<div className="event-name">
							<input className="event-name-input" type="text" name="name" id="name" defaultValue={event.name} onChange={onChangeInputHandler} />
							<label htmlFor="name"><i className="fa fa-pen"></i>Topic</label>
							{validationError.name && <ValidationError message={validationError.name} />}
						</div>
						<div className="event-date edit">
							<input className="event-date-input-box" type="number" name="year" id="year" min={2021} max={2050} placeholder="YYYY" defaultValue={event.dateObj.year} />
							<input className="event-date-input-box" type="number" name="month" id="month" min={1} max={12} placeholder="MM" defaultValue={event.dateObj.month} />
							<input className="event-date-input-box" type="number" name="day" id="day" min={1} max={31} placeholder="DD" defaultValue={event.dateObj.day} />
							<input className="event-date-input-box" type="number" name="hour" id="hour" min={0} max={24} placeholder="HH" defaultValue={event.dateObj.hour} />
							<input className="event-date-input-box" type="number" name="minute" id="minute" min={0} max={59} placeholder="MM" defaultValue={event.dateObj.minute} />
							<label htmlFor="date"><i className="fa fa-pen"></i>Date and time</label>
						</div>
						{validationError.date && <ValidationError message={validationError.date} />}
						<div className="event-status">
							{event.status === 'active'
								? <span className="status-active" ><i className="fas fa-chart-line"></i>{event.status}</span>
								: <span className="status-cancelled"><i className="fas fa-ban"></i>{event.status}</span>
							}
						</div>
						<div className="event-default-image">
							{isImageLoading ? <Loader /> : <img src={imagePreview} alt="Event_Image" />}

						</div>
						<div className="event-image">
							<input className="event-image-input" type="file" accept="image/*" lang="en" name="imageUrl" id="imageUrl" onChange={onChangeImageHandler} />
							<label htmlFor="image"><i className="fas fa-image"></i>Image</label>
							{validationError.image && <ValidationError message={validationError.image} />}
						</div>
					</div>
					<div className="event-form-body-details">
						<div className="event-description">
							<textarea className="event-description-input" type="text" name="description" id="description" cols="50" rows="12" defaultValue={event.description} onChange={onChangeInputHandler} />
							<label htmlFor="description"><i className="fa fa-pen"></i>Description</label>
							{validationError.description && <ValidationError message={validationError.description} />}
						</div>
						<MapEvent center={event.location} getGeoPoint={getGeoPoint} message={'Current location'} />
					</div>
					<div className="event-edit-form-footer">
						<div className="event-actions cancel">
							{event.status === 'active'
								? <div className="event-actions-icon">
									<i className="far fa-calendar-check"></i>
									<Link className="cancel-event-link" to={`/events/${event.id}/cancel`} onClick={onClickCancelEventHandler} >CANCEL EVENT</Link>
								</div>
								: null
							}
						</div>
						<div className="recommend">
							<p>Organised by</p>
							<h3>{user.username}</h3>
						</div>
						<div className="event-action">
							<button className="event-action-btn" type="submit">Edit event</button>
						</div>
						{validationError.required && <ValidationError message={validationError.required} />}
					</div>
				</form>
			</div>
		</>
	)
}

export default EventEdit;
