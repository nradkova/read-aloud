import Parse from "../config/server";

const getAllCommentsByBookId = async function (bookId) {
	const book = new Parse.Object('Book');
	book.id = bookId;

	const BookComment = Parse.Object.extend('BookComment');
	const query = new Parse.Query(BookComment);
	query.include('creator');
	query.equalTo('book', book);
	query.descending('createdAt');

	try {
		const data = await query.find();
		const results = data.reduce((a, x) => {
			a.push(viewModel(x))
			return a
		}, [])
		return results;
	} catch (error) {
		console.error('Error while fetching BookComment', error);
	}
}

const getAllCommentsByEventId = async function (eventId) {
	const event = new Parse.Object('Event');
	event.id = eventId;

	const EventComment = Parse.Object.extend('EventComment');
	const query = new Parse.Query(EventComment);
	query.include('creator');
	query.equalTo('event', event);
	query.descending('createdAt');

	try {
		const data = await query.find();
		const results = data.reduce((a, x) => {
			a.push(viewModel(x))
			return a
		}, [])
		return results;
	} catch (error) {
		console.error('Error while fetching EventComment', error);
	}
}

const createBookComment = async (bookId, text) => {
	const book = new Parse.Object('Book');
	book.id = bookId;

	const bookComment = new Parse.Object('BookComment');
	bookComment.set('text', text);
	bookComment.set('creator', Parse.User.current());
	bookComment.set('book', book);

	try {
		await bookComment.save();
	} catch (error) {
		console.error('Error while creating BookComment: ', error);
	}
}

const createEventComment = async (eventId, text) => {
	const event = new Parse.Object('Event');
	event.id = eventId;

	const eventComment =new Parse.Object('EventComment');
	eventComment.set('text', text);
	eventComment.set('creator', Parse.User.current());
	eventComment.set('event', event);

	try {
		await eventComment.save();
	} catch (error) {
		console.error('Error while creating EventComment: ', error);
	}
}


const viewModel = (record) => {
	const creator = record.get('creator').get('username');
	const date = new Date(record.createdAt)
		.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', })

	return {
		id: record.id,
		createdAt: date,
		text: record.get('text'),
		creator,
	}
}

export {
	createBookComment,
	createEventComment,
	getAllCommentsByBookId,
	getAllCommentsByEventId
}
