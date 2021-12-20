import { useState, useEffect, useContext } from "react";
import { Link, useParams} from "react-router-dom";

import './index.css';

import userService from "../../services/user";
import { getBookById } from "../../services/book";
import AuthContext from "../../context/authContext";
import { createBookComment, getAllCommentsByBookId } from "../../services/comment";

import Star from "../../components/star";
import Loader from "../../components/loader";
import Rating from "../../components/rating";
import CustomComment from "../../components/comment";
import PageLayout from "../../components/pageLayout";



const BookDetails = () => {
	const { user } = useContext(AuthContext);
	const { bookId } = useParams();

	const [isLoading, setIsloading] = useState(false);

	const [isGuest, setIsGuest] = useState(true);
	const [isUser, setIsUser] = useState(false);
	const [isCreator, setIsCreator] = useState(false);
	const [canVote, setCanVote] = useState(false);
	const [canAdd, setCanAdd] = useState(true);


	const [book, setBook] = useState({
		id: "",
		title: "",
		author: "",
		description: "",
		imageUrl: "",
		rating: 0,
		voted: [],
		createdAt: "",
		creator: "",
		category: []
	});


	const [comments, setComments] = useState([]);

	useEffect(() => {
		async function fetchData() {
			setIsloading(true);
			const book = await getBookById(bookId);
			setIsloading(false);
			setBook(book);
			if (user.username === book.creator) {
				setIsCreator(true);
				setIsUser(false);
				setIsGuest(false);
			} else if (Boolean(user.username)) {
				setIsUser(true);
				setIsGuest(false);
				setIsCreator(false)
			} else {
				setIsGuest(true);
				setIsUser(false);
				setIsCreator(false)
			}
			if (Boolean(user.username) && user.username !== book.creator && !book.voted.includes(user.userId)) {
				setCanVote(true);
			}
			if (Boolean(user.username) && user.username !== book.creator) {
				const canAdd = await userService.checkBookInUserReadingList(user.userId, bookId);
				setCanAdd(canAdd);
			}
			const comments = await getAllCommentsByBookId(bookId);
			setComments(comments);

		}
		fetchData()
	}, [bookId, user])


	const onClickAddBookHandler = async (e) => {
		e.preventDefault();
		await userService.updateUserReadingList(user.userId, bookId);
		setCanAdd(false);
		// navigate(`/my-page/${user.userId}`)
	}
	console.log('render');
	let errorComment=false;
	const onSubmitCommentHandler = async (e) => {
		e.preventDefault();
		const text=e.target.comment.value;
		console.log(text);
		if(text.trim().length===0 ||text.trim().length>400){
			errorComment=true;
			console.log('fff');
			console.log(errorComment)
			return;
		}
		await createBookComment(bookId, text);
		const updated = await getAllCommentsByBookId(bookId);
		setComments(updated);
		e.target.comment.value = '';
	}

	// const onClickDeleteBookHandler = async(e)=>{
	// 	e.preventDefault();
	// 	await deleteBook(bookId)
	// 	navigate('/books')
	// }

	const actionsAllowed = () => {
		if (isGuest) {
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
						{canVote
							? <Rating userId={user.userId} bookId={bookId} />
							: null
						}
					</div>
					{isUser || isCreator
						? <div className="book-comments-form">
							<form action="" method="post" onSubmit={onSubmitCommentHandler}>
								<h4>You can write your comment here:</h4>
								<textarea className="comment-input" name="comment" id="comment" cols="50" rows="6"></textarea>
								{errorComment && <p className="comment-error">*Your comment can not be more than 400 characters.</p>}
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
					{/* {isCreator
						? <Link className="edit-link" to={`/books/${book.id}/edit`}>EDIT BOOK</Link>
						: null
					}
					<Link className="delete-link" to={`/books/${book.id}/delete`}  onClick={onClickDeleteBookHandler}>DELETE</Link>
					{isUser && canAdd && !isCreator
						? <Link className="add-to-reading-list-link" to={`/books/${book.id}/add`} onClick={onClickAddBookHandler} >ADD TO YOUR LIST</Link>
						: <p className="added-to-reading-list">ADDED TO YOUR LIST</p>
					} */}
				</div>
			</div>
		</PageLayout>
	)
}

export default BookDetails;