import { useState, useEffect, useContext } from "react";
import { useNavigate,useParams } from "react-router-dom";
import Category from "../../components/category";
import PageLayout from "../../components/pageLayout";
import AuthContext from "../../context/authContext";
import { createBook, getBookById } from "../../services/book";

import './index.css';

const BookEdit = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const { bookId } = useParams();
	const [book, setBook] = useState({
		id: "",
		title: "",
		author: "",
		description: "",
		imageUrl: "",
		rating: "",
		createdAt: ""
	})

	useEffect(() => {
		async function fetchData() {
			const res = await getBookById(bookId);
			setBook(res)
			// setBook({
			// 	title: "VDFSGVFSD SDFSDFSF",
			// 	author: " ASDAD FD  ERERE",
			// 	description: "FGFSDGFS SFGFSDGSG SFGSG ",
			// 	imageUrl: "https://res.cloudinary.com/dah8nslpd/image/upload/v1638182308/books/a-book-gd09600698_640_nv8vzp.png",
			// 	rating: 5,
			// 	createdAt: "November 24,2021",
			// 	creator:"David"
			// })
		}
		fetchData()
	}, [bookId])
	// const [categories, setCategories] = useState([]);
	const categories=[];

	const onBookSubmitHandler = (e) => {
		e.preventDefault();
		console.log(categories);
		const data = new FormData(e.target)
		const book = {
			title: data.get('title'),
			author: data.get('author'),
			description: data.get('description'),
			category: categories,
			image:data.get('image')
		}
		createBook(book)
			.then(res => {
				console.log(book);
				navigate('/home')
			})
			.catch(err=>console.log(err))
	}


	// const onCategoryBlurHandler = (e) => {
	// 	e.preventDefault();
	// 	const updated = categories.slice();
	// 	const value = e.target.value;
	// 	if (value && !updated.includes(value)) {
	// 		updated.push(value);
	// 	}
	// 	setCategories(updated);
	// 	e.target.value = '';
	// }

	// const onCategoryClickHandler = (e) => {
	// 	const value = e.target.value;

	// 	const updated = categories.slice();

	// 	updated.splice(updated.indexOf(value), 1)
	// 	setCategories(updated)
	// }

	// const onImageChangeHandler=async(e)=>{
	// 	const apiUrl="https://api.cloudinary.com/v1_1/dah8nslpd/image/upload";
	// 	const files=e.target.files;
	// 	const data=new FormData();
	// 	data.append('file',files[0]);
	// 	data.append("upload_preset","ReadAloud");

	// 	const res=await fetch(apiUrl,{method:"POST",body:data})
	// 	const result=await res.json();
	// 	console.log(result.url);
	// }

	return (
		<PageLayout>
			<div className="book-form-container">
				<div className="book-form-title">
					<h3><i className="fa fa-arrow-right"></i>Edit book</h3>
				</div>
				<form className="book-form-body" onSubmit={onBookSubmitHandler}>
					<div className="book-form-body-main">
						<div className="title">
							<input className="title-input" type="text" name="title" id="title" value={book.title} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Title</label>
						</div>
						<div className="author">
							<input className="author-input" type="text" name="author" id="author" value={book.author} />
							<label htmlFor="title"><i className="fa fa-pen"></i>Author</label>
						</div>
						<div className="default-image">
							<img src={book.imageUrl} alt="" />
						</div>
						<div className="image">
							<input className="image-input" type="file" name="image" id="image" />
							{/* <input type="file" name="image" id="image" onChange={onImageChangeHandler} /> */}
							<label htmlFor="image"><i className="fas fa-image"></i>Image</label>
						</div>
					</div>
					<div className="book-form-body-details">
						<div className="description">
							<textarea className="description-input" type="text" name="description" id="description" cols="50" rows="12" value={book.description} />
							<label htmlFor="description"><i className="fa fa-pen"></i>Description</label>
						</div>
						<Category selectedCategories={categories}/>
						{/* <div className="category">
							<input className="category-input" type="text" name="category" id="category" onBlur={onCategoryBlurHandler} />
							<span className="add-category"><i className="fa fa-pen"></i> Add category</span>
						</div>
						<div className="categories-list">
							{categories.map(x => <span key={x} className="category-list-item" onClick={onCategoryClickHandler} ><i className="fas fa-times"></i>{x}</span>)}
						</div> */}
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

export default BookEdit;