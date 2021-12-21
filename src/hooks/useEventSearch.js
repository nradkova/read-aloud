import { useState } from "react";

import {
    getMyEvents,
    getMyEventsCount,
    getAllEvents,
    getAllEventsCount,
    getActiveEvents,
    getActiveEventsCount,
    getCancelledEvents,
    getCancelledEventsCount,
} from "../services/event";


let isDisabledIncreaseButton = true;
let isDisabledDecreaseButton = true;

let searchMessage = {
    criteria: null,
    search: null
}

const useEventSearch = (username) => {
    const [query, setQuery] = useState({all:true});
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({ counter: 1, perPage: 2, totalPages: 0, count: 0 });
    const [isLoading, setIsloading] = useState(false);

    const requestCountHandler = async () => {

        setIsloading(true);
        let count = 0;
        if (query.all) {
            count = await getAllEventsCount();
        }
        if (query.myEvents) {
            count = await getMyEventsCount(username);
        }
        if (query.active) {
            count = await getActiveEventsCount();
        }
        if (query.cancelled) {
            count = await getCancelledEventsCount();
        }
        const totalPages = Math.ceil(count / pagination.perPage);
        if (totalPages <= 1) {
            isDisabledIncreaseButton = true;
            isDisabledDecreaseButton = true;
        }
        if (totalPages > 1) {
            isDisabledIncreaseButton = false;
        }

        setPagination(prev => ({ ...prev, count, totalPages }));
        setIsloading(false);
    }

    const requestDataHandler = async () => {
        setIsloading(true);
        let events = [];
        if (query.all) {
            events = await getAllEvents(pagination);
        }
        if (query.myEvents) {
            events = await getMyEvents(username, pagination);
        }
        if (query.active) {
            events = await getActiveEvents(pagination);
        }
        if (query.cancelled) {
            events = await getCancelledEvents(pagination);
        }

        setEvents(events);
        setIsloading(false);
    }

    const increaseCounter = () => {
        const counter = pagination.counter + 1;
        if (counter >= pagination.totalPages) {
            isDisabledIncreaseButton = true;
        }
        isDisabledDecreaseButton = false;
        setPagination(prev => ({ ...prev, counter: counter }));
    }

    const decreaseCounter = () => {
        const counter = pagination.counter - 1;
        if (counter === 1) {
            isDisabledDecreaseButton = true;
        }
        isDisabledIncreaseButton = false;
        setPagination(prev => ({ ...prev, counter: counter }));
    }


    const onClickMyEventsHandler = async () => {
        setPagination(prev => ({ ...prev, counter: 1 }));
        setQuery({myEvents: username });
        searchMessage = { criteria: username + ' profile', search: 'events' };
    }

    const onClickAllEventsHandler = async () => {
        setPagination(prev => ({ ...prev, counter: 1 }));
        setQuery({all:true });
        searchMessage.criteria = null;
    }

    const onClickActiveEventsHandler = async () => {
        setPagination(prev => ({ ...prev, counter: 1 }));
        setQuery({active: true});

        searchMessage = { criteria: 'active', search: 'events' };
    }

    const onClickCancelledEventsHandler = async () => {
        setPagination(prev => ({ ...prev, counter: 1 }));
        setQuery({cancelled: true});
        searchMessage = { criteria: 'cancelled', search: 'events' };
    }



    return {
        query,
        events,
        pagination,
        isLoading,
        searchMessage,
        isDisabledIncreaseButton,
        isDisabledDecreaseButton,
        decreaseCounter,
        increaseCounter,
        onClickMyEventsHandler,
        onClickAllEventsHandler,
        onClickActiveEventsHandler,
        onClickCancelledEventsHandler,
        requestCountHandler,
        requestDataHandler,
    }
}

export default useEventSearch;