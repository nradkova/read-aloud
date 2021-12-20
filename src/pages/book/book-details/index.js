import {useContext } from "react";
import { Link, useParams} from "react-router-dom";

import './index.css';

import useBook from "../../../hooks/useBook";
import AuthContext from "../../../context/authContext";

import Star from "../../../components/star";
import Loader from "../../../components/loader";
import Rating from "../../../components/rating";
import CustomComment from "../../../components/comment";
import PageLayout from "../../../components/page-layout";

const BookDetails = () => {
	const {isAuthenticated, user } = useContext(AuthContext);
	const { bookId } = useParams();

	const{
        book,
        isLoading,
        isCreator,
        canVote, 
        canAdd,
        comments,
        validationError,
        onClickAddBookHandler,
        onSubmitCommentHandler
    }=useBook(bookId,isAuthenticated,user)

	const actionsAllowed = () => {
		if (!isAuthenticated) {
			return <Link className="join-link" to={'/register'}>JOIN US</Link>;
		}
		if (isCreator) {
			return <Link className="edit-link" to={`/books/${book.id}/edit`}>EDIT BOOK</Link>;
		}
		if (canAdd) {
			return <Link className="add-to-reading-list-link" to={`/books/${book.id}/add`} onClick={onClickAddBookHandler} >ADD TO YOUR LIST</Link>;
		} else {
			return <p className="added-to-reading-list">ADDED TO YOUR LIST</p>;
		}
	}

	if(isLoading){
		return (
			<PageLayout>
				<Loader/>
			</PageLayout>
		)
	}

	return (
		<PageLayout>
			<h1>Book</h1>
			<div className="book-details-container">
				<div className="book-main">
					<h4 className="book-author">{book.author}</h4>
					<h1 className="book-title">{book.title}</h1>
					<div className="book-details">
						<span><i className="far fa-clock"></i>{book.createdAt}</span>
						<span><i className="far fa-user"></i>{book.creator}</span>
						<span><i className="far fa-comment-alt"></i>{comments.length}</span>
					</div>
					{!canVote
						? <Star rating={book.rating} />
						: null
					}
					<div className="book-image">
						<img src={book.imageUrl ? book.imageUrl : "/default_book.png"} alt="Book_cover" />
					</div>
					<p className="book-description">{book.description}</p>
					<div className="book-categories">
						{book.category.map(x => <span key={x}><i className="far fa-circle"></i>{x}</span>)}
					</div>
				</div>
				<div className="book-additional">
					<div className="book-comments">
						{comments.length > 0
							? comments.map(x => <CustomComment key={x.id} createdAt={x.createdAt} text={x.text} creator={x.creator} />)
							: <p>No comments yet... Be the first one to comment!</p>}
					</div>
					<div className="book-rating">
						{canVote && <Rating userId={user.userId} bookId={bookId} />}
					</div>
					{isAuthenticated
						? <div className="book-comments-form">
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
				<div className="book-actions">
					<div className="book-actions-icon">
						<i className="far fa-calendar-check"></i>
					</div>
					{actionsAllowed()}
				</div>
			</div>
		</PageLayout>
	)
}

export default BookDetails;

	// const onClickDeleteBookHandler = async(e)=>{
	// 	e.preventDefault();
	// 	await deleteBook(bookId)
	// 	navigate('/books')
	// }