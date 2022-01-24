import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";

import './index.css';

import authServices from '../../../services/user';
import AuthContext from "../../../context/authContext";
import { getMySubscriptions, unsignSubscription } from '../../../services/subscription';

import Title from "../../../components/title";
import Loader from '../../../components/loader';
import PageLayout from "../../../components/page-layout";
import Notification from '../../../components/notification';
import BookCardLite from '../../../components/book-card-lite';
import EventCardLite from '../../../components/lite-event-card';
import NotificationContext from '../../../context/notificationContext';

let pagesReadingCounter = 1;
let pagesEventCounter = 1;


const MyPage = () => {
	const { userId } = useParams();
	const { user } = useContext(AuthContext);
	const {notification, showNotification} = useContext(NotificationContext);

	const [update, setUpdate] = useState({reading:false,events:false});
	const [isLoading, setIsloading] = useState(false);
	const [readingList, setReadingList] = useState({all:[],view:[]});
	const [eventList, setEventList] = useState({all:[],view:[]});
	const [totalPages, setTotalPages] = useState({reading:0,events:0});
	const [readingListButtonsDisabled, setReadingListButtonsDisabled] = useState({increase:true,decrease:true});
	const [eventListButtonsDisabled, setEventListButtonsDisabled] = useState({increase:true,decrease:true});

	useEffect(() => {
		const fetchData = async () => {

			setIsloading(true);
			const fetchedReadingListData = await authServices.getUserReadingList(userId);
			const fetchedEventListData = await getMySubscriptions(user.username);
			setIsloading(false);

			const readingPages = Math.ceil(fetchedReadingListData.length / 3);
			const eventPages = Math.ceil(fetchedEventListData.length / 3);

			setTotalPages({reading:readingPages,events:eventPages});
			
			if (readingPages > 1) {
				setReadingListButtonsDisabled({increase:false,decrease:true});
			}else{
				setReadingListButtonsDisabled({increase:true,decrease:true});
			}
			pagesReadingCounter=1;

			if (eventPages > 1) {
				setEventListButtonsDisabled(prev=>({...prev,increase:false}));
			}else{
				setEventListButtonsDisabled({increase:true,decrease:true});
			}
			pagesEventCounter=1;
			
			setReadingList(prev=>({all:fetchedReadingListData,view:fetchedReadingListData.slice(0, 3)}));
			setEventList(prev=>({all:fetchedEventListData,view:fetchedEventListData.slice(0, 3)}));
		}
		fetchData()
	}, [userId,update])

	const increaseReadingCounter = () => {
		pagesReadingCounter++;
		if (pagesReadingCounter >= totalPages.reading) {
			setReadingListButtonsDisabled(prev=>({increase:true,decrease:false}));
		}else{
			setReadingListButtonsDisabled(prev=>({increase:false,decrease:false}));
		}
		setReadingList(prev=>({...prev,view:readingList.all.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3)}));
	}

	const decreaseReadingCounter = () => {
		pagesReadingCounter--;
		if (pagesReadingCounter === 1) {
			setReadingListButtonsDisabled(prev=>({increase:false,decrease:true}));
		}else{
			setReadingListButtonsDisabled(prev=>({increase:false,decrease:false}));
		}
		setReadingList(prev=>({...prev,view:readingList.all.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3)}));
	}

	const increaseEventCounter = () => {
		pagesEventCounter++;
		if (pagesEventCounter >= totalPages.events) {
			setEventListButtonsDisabled(prev=>({increase:true,decrease:false}));
		}else{
			setEventListButtonsDisabled(prev=>({increase:false,decrease:false}));
		}
		setEventList(prev=>({...prev,view:eventList.all.slice((pagesEventCounter * 3) - 3, pagesEventCounter * 3)}));
	}

	const decreaseEventCounter = () => {
		pagesEventCounter--;
		if (pagesEventCounter === 1) {
			setEventListButtonsDisabled(prev=>({increase:false,decrease:true}));
		}else{
			setEventListButtonsDisabled(prev=>({increase:false,decrease:false}));
		}
		setEventList(prev=>({...prev,view:eventList.all.slice((pagesEventCounter * 3) - 3, pagesEventCounter * 3)}));
	}

	const onClickRemoveBook = async (e, id) => {
		e.preventDefault();
		showNotification("You are above to remove this book from your reading list!",id);
	}

	const onClickRemoveEvent = async (e,subscriptionId) => {
		e.preventDefault();
		showNotification("You are above to remove this event from your event list!",subscriptionId);
	}
	
	
	
	useEffect(()=>{
		if(notification.message.includes('book') && notification.result==="confirm"){
			authServices.removeBookFromUserReadingList(userId, notification.objectId)
			.then(res=>{
				setUpdate(prev=>({reading:res,events:false}));
			})
		}
		if(notification.message.includes('event') && notification.result==="confirm"){
			unsignSubscription(user.username, notification.objectId)
			.then(res=>{
				setUpdate(prev=>({reading:false,events:res}));
			})
		}

	},[notification.result])

	

	if (isLoading) {
		return (
			<PageLayout>
				<Loader />
			</PageLayout>
		)
	}
	
	return (
		<PageLayout>
			<Notification/>
			<Title title={user.username.toLocaleUpperCase() + ' \'s page'} />
			<div className="my-page-container">

				<div className="my-page-navigation">
					<Link className="create-book-link" to="/books/create"><i className="fas fa-plus"></i>POST NEW BOOK</Link>
					<Link className="create-event-link" to="/events/create"><i className="fas fa-plus"></i>POST NEW EVENT</Link>
				</div>
				<div className="my-page-events-list">
					<h3 className="my-page-events-list-title">MY EVENT SCHEDULE</h3>
					{eventList.view.length > 0
						? <>
							<div className="my-page-reading-list-items-container">
								<button className="prev" disabled={eventListButtonsDisabled.decrease} onClick={decreaseEventCounter}>&#10094;</button>
								<div className="my-page-reading-list-items">
									{eventList.view.map(x => <EventCardLite onClickSignoutEvent={(e) => onClickRemoveEvent(e, x.subscriptionId)} key={x.subscriptionId} eventId={x.eventId} imageUrl={x.imageUrl} date={x.date} name={x.name} status={x.status} />)}
								</div>
								<button className="next" disabled={eventListButtonsDisabled.increase} onClick={increaseEventCounter}>&#10095;</button>
							</div>
							<p>{pagesEventCounter}/{totalPages.events}</p>
						</>
						: <p className="empty-reading-list">You have not added anything to your event list yet.</p>
					}

				</div>
				<div className="my-page-reading-list">
					<h3 className="my-page-reading-list-title">MY READING LIST</h3>
					{readingList.view.length > 0
						? <>
							<div className="my-page-reading-list-items-container">
								<button className="prev" disabled={readingListButtonsDisabled.decrease} onClick={decreaseReadingCounter}>&#10094;</button>
								<div className="my-page-reading-list-items">
									{readingList.view.map(x => <BookCardLite onClickRemoveBook={(e) => onClickRemoveBook(e, x.id)} key={x.id} userId={userId} bookId={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} />)}
								</div>
								<button className="next" disabled={readingListButtonsDisabled.increase} onClick={increaseReadingCounter}>&#10095;</button>
							</div>
							<p>{pagesReadingCounter}/{totalPages.reading}</p>
						</>
						: <p className="empty-reading-list">You have not added anything to your reading list yet.</p>
					}
				</div>
			</div>
		</PageLayout>
	)
}

export default MyPage;