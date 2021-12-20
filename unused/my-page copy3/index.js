import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";

import './index.css';

import authServices from '../../src/services/user';
import AuthContext from "../../src/context/authContext";
import { getMySubscriptions, unsignSubscription } from '../../src/services/subscription';

import Title from "../../src/components/title";
import Loader from '../../src/components/loader';
import PageLayout from "../../src/components/page-layout";
import Notification from '../../src/components/notification';
import BookCardLite from '../../src/components/book-card-lite';
import EventCardLite from '../../src/components/lite-event-card';
import NotificationContext from '../../src/context/notificationContext';

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
	const [readingListButton, setReadingListButton] = useState({increase:true,decrease:true});
	const [eventListButton, setEventListButton] = useState({increase:true,decrease:true});

	useEffect(() => {
		const fetchData = async () => {

			setIsloading(true);
			const fetchedReadingListData = await authServices.getUserReadingList(userId);
			const fetchedEventListData = await getMySubscriptions(user.username);
			setIsloading(false);

			console.log(fetchedReadingListData);
			console.log(fetchedEventListData);

			const readingPages = Math.ceil(fetchedReadingListData.length / 3);
			const eventPages = Math.ceil(fetchedEventListData.length / 3);

			setTotalPages({reading:readingPages,events:eventPages});

			console.log(readingPages);
			console.log(eventPages);

			if (readingPages > 1) {
				// setIsDisabledIncreaseButton(false);
				setReadingListButton(prev=>({...prev,increase:false}));
			}else{
				// setIsDisabledIncreaseButton(true);
				// setIsDisabledDecreaseButton(true);
				setReadingListButton({increase:true,decrease:true});
				pagesReadingCounter=1;
			}

			if (eventPages > 1) {
				// setIsDisabledIncreaseButton(false);
				setEventListButton(prev=>({...prev,increase:false}));
			}else{
				// setIsDisabledIncreaseButton(true);
				// setIsDisabledDecreaseButton(true);
				setEventListButton({increase:true,decrease:true});
				pagesEventCounter=1;
			}
			setReadingList({all:fetchedReadingListData,view:fetchedReadingListData.slice(0, 3)});
			// setViewReadingList(fetchedReadingListData.slice(0, 3))
			setEventList({all:fetchedEventListData,view:fetchedEventListData.slice(0, 3)});
		}
		fetchData()

	}, [userId,update])

	const increaseReadingCounter = () => {
		pagesReadingCounter++;
		if (pagesReadingCounter >= totalPages.reading) {
			// setIsDisabledIncreaseButton(true);
			setReadingListButton(prev=>({...prev,increase:true}));
		}
		// setViewReadingList(x => readingList.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3));
		setReadingList(prev=>({...prev,view:readingList.all.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3)}));
		// setIsDisabledDecreaseButton(false);
		setReadingListButton(prev=>({...prev,decrease:false}));
	}

	const decreaseReadingCounter = () => {
		pagesReadingCounter--;
		if (pagesReadingCounter === 1) {
			// setIsDisabledDecreaseButton(true);
			setReadingListButton(prev=>({decrease:true,increase:true}));
		}
		// setViewReadingList(x => readingList.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3));
		setReadingList(prev=>({...prev,view:readingList.all.slice((pagesReadingCounter * 3) - 3, pagesReadingCounter * 3)}));
		// setIsDisabledIncreaseButton(false);
		setReadingListButton(prev=>({...prev,increase:false}));
	}

	const increaseEventCounter = () => {
		pagesEventCounter++;
		if (pagesEventCounter >= totalPages.events) {
			setEventListButton(prev=>({...prev,increase:true}));
		}
		setEventList(prev=>({...prev,view:eventList.all.slice((pagesEventCounter * 3) - 3, pagesEventCounter * 3)}));
		setEventListButton(prev=>({...prev,decrease:false}));
	}

	const decreaseEventCounter = () => {
		pagesEventCounter--;
		if (pagesEventCounter === 1) {
			setEventListButton(prev=>({decrease:true,increase:true}));
		}
		setEventList(prev=>({...prev,view:eventList.all.slice((pagesEventCounter * 3) - 3, pagesEventCounter * 3)}));
		setEventListButton(prev=>({...prev,increase:false}));
	}
	const onClickRemoveBook = async (e, id) => {
		e.preventDefault();
		showNotification("You are above to remove this book fron your reading list!",id);
		// setToBeRemoved(prev=>({...prev,bookId:id}))
	}
	
	
	
	useEffect(()=>{
		console.log(notification);
		// console.log(toBeRemoved);

		if(notification.message.includes('book') && notification.result==="confirm"){
			console.log("in");
			authServices.removeBookFromUserReadingList(userId, notification.objectId)
			.then(res=>{
				setUpdate({reading:res,events:false});
				console.log(res);
				// setToBeRemoved(prev=>({...prev,bookId:''}))
			})
		}

	},[notification.result])

	const onClickRemoveEvent = async (e,username, eventId) => {
		e.preventDefault();
		const isRemoved = await unsignSubscription(username, eventId);
		setUpdate({reading:false,events:isRemoved});
	}

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
								<button className="prev" disabled={eventListButton.decrease} onClick={decreaseEventCounter}>&#10094;</button>
								<div className="my-page-reading-list-items">
									{eventList.view.map(x => <EventCardLite onClickSignoutEvent={(e) => onClickRemoveEvent(e,user.username, x.subscriptionId)} key={x.subscriptionId} eventId={x.eventId} imageUrl={x.imageUrl} date={x.date} name={x.name} status={x.status} />)}
								</div>
								<button className="next" disabled={eventListButton.increase} onClick={increaseEventCounter}>&#10095;</button>
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
								<button className="prev" disabled={readingListButton.decrease} onClick={decreaseReadingCounter}>&#10094;</button>
								<div className="my-page-reading-list-items">
									{readingList.view.map(x => <BookCardLite onClickRemoveBook={(e) => onClickRemoveBook(e, x.id)} key={x.id} userId={userId} bookId={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} />)}
								</div>
								<button className="next" disabled={readingListButton.increase} onClick={increaseReadingCounter}>&#10095;</button>
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