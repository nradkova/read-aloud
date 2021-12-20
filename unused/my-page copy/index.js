import { Link, Navigate } from 'react-router-dom';
import { useParams,useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";

import './index.css';

import authServices from '../../src/services/user';
import AuthContext from "../../src/context/authContext";

import Title from "../../src/components/title";
import Loader from '../../src/components/loader';
import PageLayout from "../../src/components/page-layout";
import BookCardLite from '../../src/components/book-card-lite';

let pagesCounter = 1;

const MyPage = () => {
	const { userId } = useParams();
	const { user } = useContext(AuthContext);
	const [update, setUpdate] = useState(false);
	const [isLoading, setIsloading] = useState(false);
	const [readingList, setReadingList] = useState([]);
	const [viewReadingList, setViewReadingList] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [isDisabledIncreaseButton, setIsDisabledIncreaseButton] = useState(true);
	const [isDisabledDecreaseButton, setIsDisabledDecreaseButton] = useState(true);


	useEffect(() => {
		const fetchData = async () => {

			setIsloading(true);
			const fetchedReadingListData = await authServices.getUserReadingList(userId);
			setIsloading(false);
			console.log(fetchedReadingListData);
			const pages = Math.ceil(fetchedReadingListData.length / 3);
			setTotalPages(pages);
			console.log(pages);
			if (pages > 1) {
				setIsDisabledIncreaseButton(false);
			}else{
				setIsDisabledIncreaseButton(true);
				setIsDisabledDecreaseButton(true);
				pagesCounter=1;
			}
			setReadingList(fetchedReadingListData);
			setViewReadingList(fetchedReadingListData.slice(0, 3))
		}
		fetchData()

	}, [userId,update])

	const increaseCounter = () => {
		pagesCounter++;
		if (pagesCounter >= totalPages) {
			setIsDisabledIncreaseButton(true);
		}
		setViewReadingList(x => readingList.slice((pagesCounter * 3) - 3, pagesCounter * 3));
		setIsDisabledDecreaseButton(false);
	}

	const decreaseCounter = () => {
		pagesCounter--;
		if (pagesCounter === 1) {
			setIsDisabledDecreaseButton(true);
		}
		setViewReadingList(x => readingList.slice((pagesCounter * 3) - 3, pagesCounter * 3));
		setIsDisabledIncreaseButton(false);
	}

	const onClickRemoveBook = async (e, bookId) => {
		e.preventDefault();
		const isRemoved = await authServices.removeBookFromUserReadingList(userId, bookId);
		setUpdate(isRemoved);
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
			<Title title={user.username.toLocaleUpperCase() + ' \'s page'} />
			<div className="my-page-container">

				<div className="my-page-navigation">
					<Link className="create-book-link" to="/books/create"><i className="fas fa-plus"></i>POST NEW BOOK</Link>
					<Link className="create-event-link" to="/events/create"><i className="fas fa-plus"></i>POST NEW EVENT</Link>
				</div>
				<div className="my-page-events-list">
					<h3 className="my-page-events-list-title">MY EVENT SCHEDULE</h3>
				</div>
				<div className="my-page-reading-list">
					<h3 className="my-page-reading-list-title">MY READING LIST</h3>
					{readingList.length > 0
						? <>
							<div className="my-page-reading-list-items-container">
								<button className="prev" disabled={isDisabledDecreaseButton} onClick={decreaseCounter}>&#10094;</button>
								<div className="my-page-reading-list-items">
									{viewReadingList.map(x => <BookCardLite onClickRemoveBook={(e) => onClickRemoveBook(e, x.id)} key={x.id} userId={userId} bookId={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} />)}
								</div>
								<button className="next" disabled={isDisabledIncreaseButton} onClick={increaseCounter}>&#10095;</button>
							</div>
							<p>{pagesCounter}/{totalPages}</p>
						</>
						: <p className="empty-reading-list">You have not added anything to your reading list yet.</p>
					}
				</div>
			</div>
		</PageLayout>
	)
}

export default MyPage;