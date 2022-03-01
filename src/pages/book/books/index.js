import { useEffect, useContext } from "react";

import './index.css';

import AuthContext from "../../../context/authContext";
import useBookSearch from "../../../hooks/useBookSearch";

import Title from "../../../components/title";
import Loader from "../../../components/loader";
import BookCardMedium from "../../../components/book-card-medium";
import ValidationError from "../../../components/validation-error";

const Books = () => {
	const { user,isAuthenticated } = useContext(AuthContext);
	const {
		query,
		books,
		pagination,
		isLoading,
		validationError,
		searchMessage,
		isDisabledIncreaseButton,
		isDisabledDecreaseButton,
		decreaseCounter,
		increaseCounter,
		onClickMyPostsHandler,
		onClickAllPostsHandler,
		onSubmitSearchHandler,
		requestCountHandler,
		requestDataHandler,
	} = useBookSearch(user.username)


	useEffect(() => {
		requestCountHandler();
	},[query]);

	
	useEffect(() => {
		if(pagination.count>0){
			requestDataHandler();
		}
	}, [pagination]);


	const searchMyPosts = (
		<div className="search-my-posts">
			<div className="search-my-posts-icon">
				<i className="far fa-calendar-check"></i>
				<span className="search-my-posts-action" onClick={onClickMyPostsHandler} >MY BOOKS</span>
			</div>
		</div>
	)

	const searchAllPosts = (
		<div className="search-all-posts">
			<div className="search-all-posts-icon">
				<i className="far fa-calendar-check"></i>
				<span className="search-all-posts-action" onClick={onClickAllPostsHandler} >ALL BOOKS</span>
			</div>
		</div>
	)

	const searchResults = (
		<>
			{!query.all && searchMessage.criteria && <p className="search-message">Found &nbsp; <strong>{pagination.count}</strong>	&nbsp; search results for	&nbsp; <strong>{searchMessage.search}</strong>	&nbsp; in 	&nbsp;<strong>{searchMessage.criteria}</strong>	&nbsp;</p>}
			{query.all && <p className="search-message">Latest books...</p>}
			<div className="books-container search">
				<button className="prev-books" disabled={isDisabledDecreaseButton} onClick={decreaseCounter}>&#10094;</button>
				<div className="books-inner-container">
					{books.map(x => <BookCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} rating={x.rating} />)}
				</div>
				<button className="next-books" disabled={isDisabledIncreaseButton} onClick={increaseCounter}>&#10095;</button>
			</div>
			<p className="search-pages">{(pagination.totalPages===0 ?pagination.counter-1:pagination.counter)}/{pagination.totalPages}</p>
		</>
	)

	return (
		<>
			<Title title="Books" />
			<div className="search-posts">
			{searchAllPosts}
			{isAuthenticated && searchMyPosts}
			</div>
			<div className="all-books-container">
				<div className="search-container">
					<form action="" onSubmit={onSubmitSearchHandler}>
						<input className="main-input" type="text" placeholder="Search by key and criteria..." name="search" />
						<div className="search-options-list">
							<div className="search-option popup-title">
								<label className="search-options-label-title">
									<input type="radio" className="popup-title" name="criteria" defaultValue="title" />
									<i className="far fa-bookmark"></i>
									<span className="popuptext-title">BY TITLE</span>
								</label>
							</div>
							<div className="search-option popup-author">
								<label className="search-options-label-author">
									<input type="radio" className="popup-author" name="criteria" defaultValue="author" />
									<i className="far fa-edit"></i>
									<span className="popuptext-author">BY AUTHOR</span>
								</label>
							</div>
							<div className="search-option popup-category">
								<label className="search-options-label-category">
									<input type="radio" className="popup-category" name="criteria" defaultValue="category" />
									<i className="fas fa-list-ul"></i>
									<span className="popuptext-category">BY CATEGORY</span>
								</label>
							</div>
							<div className="search-option popup-postedBy">
								<label className="search-options-label-postedBy">
									<input type="radio" className="popup-postedBy" name="criteria" defaultValue="postedBy" />
									<i className="far fa-id-badge"></i>
									<span className="popuptext-postedBy">POSTED BY</span>
								</label>
							</div>
						</div>
						<button className="search-btn" type="submit"> <i className="fa fa-search"></i></button>
					</form>
					{validationError && <ValidationError message={validationError} />}
				</div>
				{isLoading ?<Loader/> :searchResults}
			</div>
			</>
	)
}

export default Books;