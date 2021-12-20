import Parse from "../config/server";
import { createEventSubscription } from "./subscription";


const createEvent = async (data) => {
	try {
		const event = new Parse.Object('Event');
		event.set('name', data.name);
		event.set('date', data.date);
		event.set('description', data.description);
		event.set('creator', Parse.User.current());
		event.set('location', new Parse.GeoPoint({latitude: data.location[0], longitude: data.location[1]}));
		event.set('imageUrl', data.image);
		event.set('status', data.status);
		const response = await event.save();

		const subscription = await createEventSubscription(response);
		// const subscription = await createEventSubscription(event.id);
		response.set('subscription', subscription);
		const result = await response.save();

		return result;
	} catch (error) {
		console.error('Error while creating event: ', error);
	}
}

const editEvent = async (eventId, data) => {
	const event = Parse.Object.extend('Event');
	const query = new Parse.Query(event);

	try {
		const event = await query.get(eventId);
		event.set('name', data.name);
		event.set('date', data.date);
		event.set('description', data.description);
		event.set('creator', Parse.User.current());
		event.set('location', new Parse.GeoPoint({latitude: data.location[0], longitude: data.location[1]}));
		event.set('imageUrl', data.image);
		// event.set('status', data.status);
		try {
			const result = await event.save();
			return result;
		} catch (error) {
			console.error('Error while updating event', error);
		}
	} catch (error) {
		console.error('Error while retrieving event', error);
	}
}

const cancelEvent = async (eventId) => {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);

	try {
		const event = await query.get(eventId);
		try {
			event.set('status', 'cancelled');
			const result = await event.save();
			return result;
		} catch (error) {
			console.error('Error while updating event', error);
		}
	} catch (error) {
		console.error('Error while retrieving event', error);
	}
}

const getEventById = async function (eventId) {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	query.include('creator');
	query.include('subscription');
	query.equalTo('objectId', eventId);

	try {
		const data = await query.first();
		const result = viewModel(data);
		return result;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getAllEvents = async function (pagination) {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	// query.include('creator');
	// query.include('subscription');
	query.descending('createdAt');
	query.skip((pagination.counter - 1) * pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getAllEventsCount = async function () {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getActiveEvents = async function (pagination) {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	// query.include('creator');
	// query.include('subscription');
	query.equalTo('status','active');
	query.greaterThan('date',new Date());
	query.ascending('date');
	query.skip((pagination.counter - 1) * pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getActiveEventsCount = async function () {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	// query.include('creator');
	// query.include('subscription');
	query.equalTo('status','active');
	query.greaterThan('date',new Date());
	query.ascending('date');
	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getCancelledEvents = async function (pagination) {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	// query.include('creator');
	// query.include('subscription');
	query.equalTo('status','cancelled');
	query.greaterThan('date',new Date());
	query.ascending('date');
	query.skip((pagination.counter - 1) * pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getCancelledEventsCount = async function () {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	// query.include('creator');
	// query.include('subscription');
	query.equalTo('status','cancelled');
	query.greaterThan('date',new Date());
	query.ascending('date');
	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getMyEvents = async function (username, pagination) {
	const innerQuery = new Parse.Query('User');
	innerQuery.equalTo('username', username.toLocaleLowerCase());
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	query.include('creator');
	// query.include('subscription');
	query.descending('createdAt');
	query.matchesQuery('creator', innerQuery);
	query.skip((pagination.counter - 1) * pagination.perPage).limit(pagination.perPage);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getMyEventsCount = async function (username) {
	const innerQuery = new Parse.Query('User');
	innerQuery.equalTo('username', username.toLocaleLowerCase());
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	query.include('creator');
	// query.include('subscription');
	query.descending('createdAt');
	query.matchesQuery('creator', innerQuery);

	try {
		return await query.count();
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getLastFourEvents = async function () {
	const event = Parse.Object.extend('Event');

	const query = new Parse.Query(event);
	query.include('creator');
	// query.include('subscription');
	query.descending('createdAt').limit(4);

	try {
		const data = await query.find();
		const results = data.map(viewModel)
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const getMostRecentEvents = async function () {
	const event = Parse.Object.extend('Event');
	const query = new Parse.Query(event);
	query.include('creator');
	// query.include('subscription');
	query.equalTo('status','active');
	query.greaterThan('date',new Date());
	query.descending('date');
	query.limit(4);

	try {
		const data = await query.find();
		const results = data.map(viewModel);
		return results;
	} catch (error) {
		console.error('Error while fetching event', error);
	}
}

const viewModel = (record) => {
	const creator = record.get('creator').get('username');
	const subscriptionId = record.get('subscription').id;
	const subscribed = record.get('subscription').get('subscribed');
	const createdAt = new Date(record.createdAt)
		.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',hour12: false });
	const dateRespone=new Date(record.get('date'));
	const date = dateRespone
		.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',hour12: false });
		
		const dateObj={
		year:dateRespone.getFullYear(),
		month:(dateRespone.getMonth()+1),
		day:dateRespone.getDate(),
		hour:(dateRespone.getHours()),
		minute:dateRespone.getMinutes()
	}
	console.log(dateObj);
	
	return {
		id: record.id,
		createdAt,
		name: record.get('name'),
		description: record.get('description'),
		imageUrl: record.get('imageUrl'),
		status: record.get('status'),
		location:[record.get('location')._latitude,record.get('location')._longitude],
		date,
		creator,
		subscriptionId,
		subscribed,
		dateObj
	}
}

export {
	createEvent,
	editEvent,
	cancelEvent,
	getEventById,
	getMyEvents,
	getMyEventsCount,
	getAllEvents,
	getAllEventsCount,
	getActiveEvents,
	getActiveEventsCount,
	getCancelledEvents,
	getCancelledEventsCount,
	getLastFourEvents,
	getMostRecentEvents
}
