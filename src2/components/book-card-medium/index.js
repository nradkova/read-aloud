import { Link } from 'react-router-dom';

import './index.css';

import Star from '../star';

const BookCardMedium = ({ id, imageUrl, title, author, rating = '0' }) => {
   
    return (
        <div className="book-card-medium">
            <span className="book-card-medium-img">
                <img src={imageUrl ? imageUrl :"/default_book.png"} alt="Book_cover" />
            </span>
            <div className="book-card-medium-content">
                <Link className="details-link" to={`/books/${id}`}>VIEW</Link>
                <div className="book-card-medium-content-text">
                    <p><span className="book-card-medium-content-heading" >Title: </span>{title}</p>
                    <p> <span className="book-card-medium-content-heading"> Author: </span>{author}</p>
                    <p><span className="book-card-medium-content-heading">Rating: </span>
                        <Star rating={rating} />
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BookCardMedium;