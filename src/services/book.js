import Parse from "../config/server";

import { createBookRating } from "./rating";

const createBook = async (data) => {
	try {
		const ratingResult = await createBookRating();

		const book = new Parse.Object('Book');
		book.set('title', data.title);
		book.set('author', data.author);
		book.set('description', data.description);
		book.set('creator', Parse.User.current());
		book.set('category', data.category);
		book.set('imageUrl', data.image);
		book.set('bookRating', ratingResult);

		const result = await book.save();
		return result;
	} catch (error) {
		console.error('Error while creating Book: ', error);
	}
}

const editBook = async (bookId, data) => {
	const Book = Parse.Object.extend('Book');
	const query = new Parse.Query(Book);

	try {
		const book = await query.get(bookId);
		book.set('title', data.title);
		book.set('author', data.author);
		book.set('description', data.description);
		book.set('creator', Parse.User.current());
		book.set('category', data.category);
		book.set('imageUrl', data.image);
		try {
			const result = await book.save();
			return result;
		} catch (error) {
			console.error('Error while updating Book', error);
		}
	} catch (error) {
		console.error('Error while retrieving Book', error);
	}
}

const deleteBook = async (bookId) => {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);

	try {
		const book = await query.get(bookId);
		try {
			const response = await book.destroy();
			console.log('Deleted ParseObject', response);
		} catch (error) {
			console.error('Error while deleting ParseObject', error);
		}
	} catch (error) {
		console.error('Error while retrieving ParseObject', error);
	}
}

const getBookById = async function (bookId) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.equalTo('objectId', bookId);

	try {
		const data = await query.first();
		const result = viewModel(data);
		return result;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getAllBooks = async function (pagination) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.descending('createdAt');
	query.skip((pagination.counter-1)*pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getAllBooksCount = async function () {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByAuthor = async function (pagination,search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.matches('author', search, 'i');
	query.skip((pagination.counter-1)*pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByAuthorCount = async function (search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.matches('author', search, 'i');

	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByTitle = async function (pagination ,search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.matches('title', search, 'i');
	query.skip((pagination.counter-1)*pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByTitleCount = async function (search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.matches('title', search, 'i');

	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}


const getBooksByCategory = async function (pagination,search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.equalTo('category', search);
	query.skip((pagination.counter-1)*pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByCategoryCount = async function (search) {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.equalTo('category', search);

	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByCreator = async function (pagination,search) {
	const innerQuery = new Parse.Query('User');
	innerQuery.equalTo('username', search.toLocaleLowerCase());

	const query = new Parse.Query('Book');
	query.include('creator');
	query.include('bookRating');
	query.matchesQuery('creator', innerQuery);
	query.skip((pagination.counter-1)*pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getBooksByCreatorCount = async function (search) {
	const innerQuery = new Parse.Query('User');
	innerQuery.equalTo('username', search.toLocaleLowerCase());

	const query = new Parse.Query('Book');
	query.include('creator');
	query.matchesQuery('creator', innerQuery);

	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}


const getLastFourBooks = async function () {
	const Book = Parse.Object.extend('Book');

	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.descending('createdAt').limit(4);

	try {
		const data = await query.find();
		const results = data.map(viewModel)
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const getMostLikedBooks = async function () {
	const BookRating = Parse.Object.extend('BookRating');
	const innerQuery = new Parse.Query(BookRating);
	innerQuery.equalTo('star', 5);

	const Book = Parse.Object.extend('Book');
	const query = new Parse.Query(Book);
	query.include('creator');
	query.include('bookRating');
	query.matchesQuery('bookRating', innerQuery);
	query.descending('createdAt');
	query.limit(4);

	try {
		const data = await query.find();
		console.log(data);
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching Book', error);
	}
}

const viewModel = (record) => {
	const creator = record.get('creator').get('username');
	const bookRatingId = record.get('bookRating').id;
	const rating = record.get('bookRating').get('star');
	const voted = record.get('bookRating').get('voted');
	const date = new Date(record.createdAt)
		.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })

	return {
		id: record.id,
		createdAt: date,
		title: record.get('title'),
		author: record.get('author'),
		description: record.get('description'),
		imageUrl: record.get('imageUrl'),
		category: record.get('category'),
		voted,
		rating,
		creator,
		bookRatingId
	}
}

export {
	createBook,
	editBook,
	deleteBook,
	getBookById,
	getAllBooks,
	getAllBooksCount,
	getLastFourBooks,
	getMostLikedBooks,
	getBooksByAuthor,
	getBooksByAuthorCount,
	getBooksByTitle,
	getBooksByTitleCount,
	getBooksByCategory,
	getBooksByCategoryCount,
	getBooksByCreator,
	getBooksByCreatorCount
}
