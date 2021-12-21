import { useState,useEffect } from 'react';


import userService from '../services/user';
import { getBookById } from '../services/book';
import { commentDataValidation } from '../utils/validation';
import { createBookComment, getAllCommentsByBookId } from '../services/comment';

const initialBookValue={
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
};

const useBook = (bookId,isAuthenticated, user) => {
	const [book, setBook] = useState(initialBookValue);
	const [isLoading, setIsloading] = useState(false);
	const [canVote, setCanVote] = useState(false);
	const [canAdd, setCanAdd] = useState(true);
	const [comments, setComments] = useState([]);
	const [validationError, setValidationError] = useState(null);
    
	const isCreator=isAuthenticated && user.username === book.creator;

	useEffect(() => {
		async function fetchData() {
			setIsloading(true);
			const book = await getBookById(bookId);
			setIsloading(false);
			setBook(book);
			if (isAuthenticated && user.username !== book.creator && !book.voted.includes(user.userId)) {
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
	}, [bookId, user,isAuthenticated])


	const onClickAddBookHandler = async (e) => {
		e.preventDefault();
		await userService.updateUserReadingList(user.userId, bookId);
		setCanAdd(false);
	}
	
	const onSubmitCommentHandler = async (e) => {
		e.preventDefault();
		const text=e.target.comment.value;
		const error=commentDataValidation(text)
		if(error){
			setValidationError(error);
			return;
		}
        if(validationError){
            setValidationError(null);
        }
		await createBookComment(bookId, text);
		const updated = await getAllCommentsByBookId(bookId);
		setComments(updated);
		e.target.comment.value = '';
	}

    return{
        book,
        isLoading,
        isCreator,
        canVote, 
        canAdd,
        comments,
        validationError,
        onClickAddBookHandler,
        onSubmitCommentHandler
    }
}

export default useBook;