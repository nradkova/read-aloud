import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import './index.css';

import AuthContext from "../../../context/authContext";
import useEventForm from "../../../hooks/useEventForm";

import Loader from "../../../components/loader";
import MapEvent from "../../../components/map-event";
import ValidationError from "../../../components/validation-error";

const EventCreate = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const {
		isLoading,
		isImageLoading,
		validationError,
		imagePreview,
		isSuccess,
		getGeoPoint,
		onChangeImageHandler,
		onBlurInputHandler,
		onSubmitEventCreateHandler
	} = useEventForm();

	useEffect(() => {
		if (isSuccess) {
			navigate('/events');
		}
	}, [isSuccess, navigate])

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
					<h3><i className="fa fa-arrow-right"></i>New event</h3>
				</div>
				<form className="event-form-body" onSubmit={onSubmitEventCreateHandler}>
					<div className="event-form-body-main">
						<div className="event-name">
							<input className="event-name-input" type="text" name="name" id="name" onBlur={onBlurInputHandler} />
							<label htmlFor="name"><i className="fa fa-pen"></i>Topic</label>
							{validationError.name && <ValidationError message={validationError.name} />}
						</div>
						<div className="event-date">
							<input className="event-date-input-box" type="number" name="year" id="year" min={2021} max={2050} placeholder="YYYY" />
							<input className="event-date-input-box" type="number" name="month" id="month" min={1} max={12} placeholder="MM" />
							<input className="event-date-input-box" type="number" name="day" id="day" min={1} max={31} placeholder="DD" />
							<input className="event-date-input-box" type="number" name="hour" id="hour" min={0} max={23} placeholder="HH" />
							<input className="event-date-input-box" type="number" name="minute" id="minute" min={0} max={59} placeholder="MM" />
							<label htmlFor="date"><i className="fa fa-pen"></i>Date and time</label>
						</div>
						{validationError.date && <ValidationError message={validationError.date} />}
						<div className="event-default-image">
							{isImageLoading ? <Loader /> : <img src={imagePreview} alt="Event_Image" />}

						</div>
						<div className="event-image">
							<input className="event-image-input" type="file" accept="image/*" lang="en" name="imageUrl" id="imageUrl"  onChange={onChangeImageHandler} />
							<label htmlFor="image"><i className="fas fa-image"></i>Image</label>
							{validationError.image && <ValidationError message={validationError.image} />}
						</div>
					</div>
					<div className="event-form-body-details">
						<div className="event-description">
							<textarea className="event-description-input" type="text" name="description" id="description" cols="50" rows="12" onBlur={onBlurInputHandler} />
							<label htmlFor="description"><i className="fa fa-pen"></i>Description</label>
							{validationError.description && <ValidationError message={validationError.description} />}
						</div>
						<MapEvent getGeoPoint={getGeoPoint} />
					</div>
					<div className="event-form-footer">
						<div className="recommend">
							<p>Organised by</p>
							<h3>{user.username}</h3>
						</div>
						<div className="event-action">
							<button className="event-action-btn" type="submit">Add to events</button>
						</div>
						{validationError.required && <ValidationError message={validationError.required} />}
					</div>
				</form>
			</div>
		</>
	)
}

export default EventCreate;
