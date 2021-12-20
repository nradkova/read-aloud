import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import './index.css';
import { DEFAULT_BOOK_URL } from "../../common";

import uploadImage from "../../services/image";
import { createBook } from "../../services/book";
import AuthContext from "../../context/authContext";
import { bookDataValidation } from "../../utils/validation";

import Loader from "../../components/loader";
import Category from "../../components/category";
import PageLayout from "../../components/pageLayout";
import ValidationError from "../../components/validationError";

const initialValidationError={
	title:null,
	author:null,
	image:null,
	description:null,
};

const BookCreate = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [isLoading, setIsloading] = useState(false);
	const [validationError, setValidationError] = useState(initialValidationError);
	const [imagePreview, setImagePreview] = useState(DEFAULT_BOOK_URL);

	const categories = [];

	const onSubmitBookHandler = (e) => {
		e.preventDefault();
		const data = new FormData(e.target)
		const book = {
			title: data.get('title'),
			author: data.get('author'),
			description: data.get('description'),
			category: categories,
			image: data.get('image')
		}
		console.log(validationError);
		if (validationError.title||validationError.description||validationError.image||validationError.author) {
			return;
		}
		createBook(book)
			.then(res => {
				console.log(book);
				navigate('/home')
			})
			.catch(err => console.log(err))

		e.target.reset();
	}

	const onBlurInputHandler = async (e) => {
		e.preventDefault();
		console.log(e.target);
		const value = e.target.value;
		const type = e.target.name;
		console.log(value)
		console.log(type)

		const error = bookDataValidation(type, value);
		setValidationError(prev=>({...prev,[type]:error}))
		console.log(error);
		if (error) {
			return;
		}
	}

	const onChangeImageHandler = (e) => {
		const value = e.target.files[0];
		const error = bookDataValidation('image', (value || ''));
		setValidationError(prev=>({...prev,'image':error}))
		if (error) {
			return;
		}
		if (!value) {
			setImagePreview(DEFAULT_BOOK_URL);
		} else {
			setIsloading(true);
			uploadImage(value)
				.then(url => {
					setIsloading(false);
					setImagePreview(url);
				})
				.catch(err => {
					console.log(err);
				})
		}
	}

	return (
		<PageLayout>
			<div className="book-form-container">
				<div className="book-form-title">
					<h3><i className="fa fa-arrow-right"></i>New book</h3>
				</div>
				<form className="book-form-body" onSubmit={onSubmitBookHandler}>
					<div className="book-form-body-main">
						<div className="title">
							<input className="title-input" type="text" name="title" id="title" onBlur={onBlurInputHandler} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Title</label>
							{validationError.title
								? <ValidationError message={validationError.title} />
								: null
							}
						</div>
						<div className="author">
							<input className="author-input" type="text" name="author" id="author" onBlur={onBlurInputHandler} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Author</label>
							{validationError.author
								? <ValidationError message={validationError.author} />
								: null
							}
						</div>
						<div className="default-image">
							{isLoading ? <Loader /> : null}
							<img src={imagePreview} alt="Book_Image" />
						</div>
						<div className="image">
							<input className="image-input" type="file" accept="image/*" lang="en" name="image" id="image" onChange={onChangeImageHandler} />
							<label htmlFor="image"><i className="fas fa-image"></i>Image</label>
							{validationError.image
								? <ValidationError message={validationError.image} />
								: null
							}
						</div>
					</div>
					<div className="book-form-body-details">
						<div className="description">
							<textarea className="description-input" type="text" name="description" id="description" cols="50" rows="12" onBlur={onBlurInputHandler} />
							<label htmlFor="description"><i className="fa fa-pen"></i>Description</label>
							{validationError.description
								? <ValidationError message={validationError.description} />
								: null
							}
						</div>
						<Category selectedCategories={categories} />
					</div>
					<div className="book-form-footer">
						<div className="recommend">
							<p>Recommended by</p>
							<h3>{user.username}</h3>
						</div>
						<div className="action">
							<button className="action-btn" type="submit">Add to books</button>
						</div>
					</div>
				</form>
			</div>
		</PageLayout>
	)
}

export default BookCreate;
