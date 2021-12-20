import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import './index.css';

import AuthContext from "../../context/authContext";
import { searchDataValidation } from "../../utils/validation";
import { getAllBooks, getBooksByAuthor, getBooksByCategory, getBooksByCreator, getBooksByTitle } from "../../services/book";

import Title from "../../components/title";
import PageLayout from "../../components/pageLayout";
import BookCardMedium from "../../components/book-card-medium";
import ValidationError from "../../components/validationError";
import Loader from "../../components/loader";

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);


  useEffect(() => {
    getAllBooksHandler()
  }, [])


  const getAllBooksHandler = async () => {
    const res = await getAllBooks();
    console.log(res);
    setBooks(res)
    // setBooks([])

  }

  const onSubmitSearchHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    const criteria = formData.get('criteria');
	  setBooks([]);
	  const error=searchDataValidation(criteria, search)
    setValidationError(error);
    if (error) {
      return;
    }

    setIsloading(true);

    if (criteria === 'postedBy') {
      const data = await getBooksByCreator(search);
      setIsloading(false);
      setBooks(data);
      setSearchMessage({ criteria: 'users', search });
    }
    if (criteria === 'category') {
      const data = await getBooksByCategory(search);
      setIsloading(false);
      setBooks(data);
      setSearchMessage({ criteria: 'books categories', search });
    }
    if (criteria === 'author') {
      const data = await getBooksByAuthor(search);
      setIsloading(false);
      setBooks(data);
      setSearchMessage({ criteria: 'books authors', search });
    }
    if (criteria === 'title') {
      const data = await getBooksByTitle(search);
      setIsloading(false);
      setBooks(data);
      setSearchMessage({ criteria: 'books titles', search });
    }
    e.target.reset();
  }

  const onClickMyPostsHandler = async () => {
    setIsloading(true);
    const data = await getBooksByCreator(user.username);
    setIsloading(false);
    setBooks(data);
    setSearchMessage({ criteria: user.username +' profile', search:'books' });
  }

  const searchMyPosts = (
    <div className="search-my-posts">
      <div className="search-my-posts-icon">
        <i className="far fa-calendar-check"></i>
        <span className="search-my-posts-action" onClick={onClickMyPostsHandler} >MY BOOKS</span>
      </div>
    </div>
  )

  return (
    <PageLayout>
      <Title title="Books" />
      {user.username && searchMyPosts}
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
        {isLoading ? <Loader /> : null}
        {searchMessage
          ? <p className="search-message">Found &nbsp; <strong>{books.length}</strong>	&nbsp; search results for	&nbsp; <strong>{searchMessage.search}</strong>	&nbsp; in 	&nbsp;<strong>{searchMessage.criteria}</strong>	&nbsp;</p>
          : null
        }
        <div className="books-inner-container">
          {books.map(x => <BookCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} rating={x.rating} />)}
        </div>
      </div>
    </PageLayout>
  )
}

export default Books;