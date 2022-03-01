import Parse from "../config/server";
import { getBookById } from "./book";


const getRatingByBookId = async (bookId) => {
    const rating = new Parse.Object('BookRating');

    const query = new Parse.Query(rating);
    query.equalTo('book', bookId);

    try {
        const results = await query.find();
        for (const object of results) {
            const id = object.id
            const star = Number(object.get('star'))
            const voted = object.get('voted')
            return {
                id,
                star,
                voted
            }
        }
    } catch (error) {
        console.error('Error while fetching BookRating', error);
    }
}

const createBookRating = async (bookId) => {
    const rating = new Parse.Object('BookRating');
    rating.set('voted', []);
    rating.set('star', 0);
    
    try {
        const result = await rating.save();
        console.log('BookRating created', result);
        return result;
    } catch (error) {
        console.error('Error while creating BookRating: ', error);
    }

}

const rateBook = async (userId, bookId, value) => {
    try {
        const book = await getBookById(bookId);

        const updatedVoted = book.voted.slice();
        updatedVoted.push(userId);
        const updatedValue = Math.floor((value + book.rating) / updatedVoted.length)

        const data = new Parse.Object('BookRating');
        data.set('objectId', book.bookRatingId)
        data.set('voted', updatedVoted);
        data.set('star', updatedValue);

       await data.save();
    } catch (error) {
        console.error('Error while updating BookRating: ', error);
    }
};

export {
    rateBook,
    createBookRating,
    getRatingByBookId
}
