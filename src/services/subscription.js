import Parse from "../config/server";

const getSubscriptionByEventId = async (eventId) => {
    const subscription = new Parse.Object('EventSubscription');
    const query = new Parse.Query(subscription);
    query.equalTo('event', eventId);

    try {
        const result = await query.find();
        return {
            id: result.id,
            subscribed: result.get('subscribed')
        }
    } catch (error) {
        console.error('Error while fetching EventSubscription', error);
    }
}

const getMySubscriptions = async (username) => {
    const subscription = new Parse.Object('EventSubscription');
    const query = new Parse.Query(subscription);
    query.include('event');
    query.containedIn('subscribed', [username]);

    try {
        const data = await query.find();
        const results = data.map(viewModel);
        return results;
    } catch (error) {
        console.error('Error while fetching EventSubscription', error);
    }
}

const createEventSubscription = async (event) => {
    const subscription = new Parse.Object('EventSubscription');
    subscription.set('subscribed', []);
    subscription.set('event', event);

    try {
        const result = await subscription.save();
        console.log('EventSubscription created', result);
        return result;
    } catch (error) {
        console.error('Error while creating EventSubscription: ', error);
    }

}

const signSubscription = async (userId, subscriptionId, subscribed) => {
    const subscription = new Parse.Object('EventSubscription');
    const query = new Parse.Query(subscription);

    try {
        const data = await query.get(subscriptionId);
        data.set('subscribed', [...subscribed, userId]);

        try {
            const result = await data.save();
            console.log('EventSubscription updated', result);
        } catch (error) {
            console.error('Error while updating EventSubscription', error);
        }
    } catch (error) {
        console.error('Error while retrieving object EventSubscription', error);
    }
}

const unsignSubscription = async (username,subscriptionId) => {
    try {
        const subscription = new Parse.Object('EventSubscription');
        const query = new Parse.Query(subscription);
        
        const data = await query.get(subscriptionId);

        const list = data.get('subscribed');
        list.splice(list.indexOf(username), 1);
        data.set('subscribed', list);

        const result = await data.save();
        console.log('EventSubscription updated', result);
        return true;
    } catch (error) {
        console.error('Error while updating EventSubscription: ', error);
    }
};

const viewModel = (record) => {
	const dateRespone=new Date(record.get('event').get('date'));
	const date = dateRespone
		.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',hour12: false });
	return {
		subscriptionId: record.id,
		name: record.get('event').get('name'),
		imageUrl: record.get('event').get('imageUrl'),
		status: record.get('event').get('status'),
		date,
        eventId:record.get('event').id
	}
}



export {
    createEventSubscription,
    signSubscription,
    getMySubscriptions,
    unsignSubscription,
    getSubscriptionByEventId
}
