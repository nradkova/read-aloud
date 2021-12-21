import { useState } from 'react';

import './index.css';

import { rateBook } from '../../services/rating';

const Rating = ({userId,bookId}) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const onSubmitRatingHandler = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const stars = Array.from(data.values());
        const value = stars.reduce((a, x) => {
            if (Number(x) > a) {
                a = Number(x);
            }
            return a;
        }, 0)

        rateBook(userId,bookId,value)
        .then(()=>{
            setIsDisabled(true)
        })
        .catch(err=>console.log(err))
    }

    return (
        <div className="rating">
            <form action="" onSubmit={onSubmitRatingHandler} className="rating-form">
                <div className="stars">
                    <input className="star star-5" id="star-5" type="checkbox" name="5" defaultValue="5" disabled={isDisabled} />
                    <label className="star star-5" htmlFor="star-5">&#9733;</label>
                    <input className="star star-4" id="star-4" type="checkbox" name="4" defaultValue="4" disabled={isDisabled}/>
                    <label className="star star-4" htmlFor="star-4">&#9733;</label>
                    <input className="star star-3" id="star-3" type="checkbox" name="3" defaultValue="3" disabled={isDisabled}/>
                    <label className="star star-3" htmlFor="star-3">&#9733;</label>
                    <input className="star star-2" id="star-2" type="checkbox" name="2" defaultValue="2" disabled={isDisabled}/>
                    <label className="star star-2" htmlFor="star-2">&#9733;</label>
                    <input className="star star-1" id="star-1" type="checkbox" name="1" defaultValue="1" disabled={isDisabled}/>
                    <label className="star star-1" htmlFor="star-1">&#9733;</label>
                </div>
                <button type="submit" disabled={isDisabled} className="rating-btn">click the stars</button>
            </form>
        </div >
    )
}

export default Rating;