import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './index.css';

import useBookForm from "../../../hooks/useBookForm";
import AuthContext from "../../../context/authContext";

import Loader from "../../../components/loader";
import Category from "../../../components/category";
import PageLayout from "../../../components/page-layout";
import ValidationError from "../../../components/validation-error";


const BookEdit = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const { bookId } = useParams();

	const categories = [];

	const {
		bookValue: book,
		notCreator,
		isLoading,
		isImageLoading,
		isSuccess,
		validationError,
		imagePreview,
		onChangeImageHandler,
		onChangeInputHandler,
		onSubmitBookEditHandler,
		setInitialBookEditValue,
	} = useBookForm(user,categories);

	
	useEffect(() => {
		if (isSuccess) {
			navigate('/books');
		}
	}, [isSuccess, navigate])
	
	useEffect(() => {
		setInitialBookEditValue(bookId);
	}, [bookId])
	
	useEffect(() => {
		if(notCreator){
			navigate('/home');
		}
	}, [notCreator,navigate])
	
	if (isLoading) {
		return (
			<PageLayout>
				<Loader />
			</PageLayout>
		)
	}

	return (
		<PageLayout>
			<div className="book-form-container">
				<div className="book-form-title">
					<h3><i className="fa fa-arrow-right"></i>Edit book</h3>
				</div>
				<form className="book-form-body" onSubmit={onSubmitBookEditHandler}>
					<div className="book-form-body-main">
						<div className="title">
							<input className="title-input" type="text" name="title" id="title" defaultValue={book.title} onChange={onChangeInputHandler} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Title</label>
							{validationError.title && <ValidationError message={validationError.title} />}
						</div>
						<div className="author">
							<input className="author-input" type="text" name="author" id="author" defaultValue={book.author} onChange={onChangeInputHandler} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Author</label>
							{validationError.author && <ValidationError message={validationError.author} />}
						</div>
						<div className="default-image">
							{isImageLoading ? <Loader /> : <img src={imagePreview} alt="Book_Image" />}
						</div>
						<div className="image">
							<input className="image-input" type="file" accept="image/*" lang="en" name="imageUrl" id="imageUrl" onChange={onChangeImageHandler} />
							<label htmlFor="image"><i className="fas fa-image"></i>Image</label>
							{validationError.image && <ValidationError message={validationError.image} />}
						</div>
					</div>
					<div className="book-form-body-details">
						<div className="description">
							<textarea className="description-input" type="text" name="description" id="description" cols="50" rows="12" defaultValue={book.description} onChange={onChangeInputHandler} />
							<label htmlFor="description"><i className="fa fa-pen"></i>Description</label>
							{validationError.description && <ValidationError message={validationError.description} />}
						</div>
						<Category selectedCategories={categories} />
						<p className="book-form-body-details-remark">*The categories you choose will replace previous.</p>
					</div>
					<div className="book-form-footer">
						<div className="recommend">
							<p>Recommended by</p>
							<h3>{user.username}</h3>
						</div>
						<div className="action">
							<button className="action-btn" type="submit">Edit book</button>
						</div>
						{validationError.required && <ValidationError message={validationError.required} />}
					</div>
				</form>
			</div>
		</PageLayout>
	)
}

export default BookEdit;