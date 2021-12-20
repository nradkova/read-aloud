import { useState, useEffect } from 'react';


import { DEFAULT_LAG_LTD, DEFAULT_MAP_CENTER } from '../common';
import { getEventById } from '../services/event';
import { signSubscription } from '../services/subscription';
import { commentDataValidation } from '../utils/validation';
import { createEventComment, getAllCommentsByEventId } from '../services/comment';

const initialEventValue = {
	id: "",
	name: "",
	date: "",
	location: '',
	description: "",
	imageUrl: "",
	status: "",
	createdAt: "",
	creator: "",
	subscriptionId: "",
	subscribed: [],
	dateObj: {}
};

const useEvent = (eventId, isAuthenticated, user) => {
	const [event, setEvent] = useState(initialEventValue);
	const [isLoading, setIsloading] = useState(false);
	const [canSubscribe, setCanSubscribe] = useState(false);
	const [comments, setComments] = useState([]);
	const [validationError, setValidationError] = useState(null);

	const isCreator = isAuthenticated && user.username === event.creator;

	useEffect(() => {
		async function fetchData() {
			setIsloading(true);
			const event = await getEventById(eventId);
			console.log(event);
			setIsloading(false);
			setEvent(event);
			console.log(event);
			if (isAuthenticated && user.username !== event.creator 
				&& !event.subscribed.includes(user.username) && event.status==="active") {
				setCanSubscribe(true);
			}
			// if (Boolean(user.username) && user.username !== book.creator) {
			// 	const canAdd = await userService.checkBookInUserReadingList(user.userId, bookId);
			// 	setCanAdd(canAdd);
			// }
			const comments = await getAllCommentsByEventId(eventId);
			setComments(comments);
		}
		fetchData()
	}, [eventId, user, isAuthenticated])


	const onClickAddEventHandler = async (e) => {
		e.preventDefault();
		await signSubscription(user.username, event.subscriptionId, event.subscribed);
		const updatedSuscribed=[...event.subscribed,user.username];
		console.log(event);
		setEvent(prev=>({...prev,subscribed:updatedSuscribed}));
		setCanSubscribe(false);
	}

	const onSubmitCommentHandler = async (e) => {
		e.preventDefault();
		const text = e.target.comment.value;
		const error = commentDataValidation(text)
		if (error) {
			setValidationError(error);
			return;
		}
		if (validationError) {
			setValidationError(null);
		}
		await createEventComment(eventId, text);
		const updated = await getAllCommentsByEventId(eventId);
		setComments(updated);
		e.target.comment.value = '';
	}

	return {
		event,
		isLoading,
		isCreator,
		canSubscribe,
		comments,
		validationError,
		onClickAddEventHandler,
		onSubmitCommentHandler
	}
}

export default useEvent;