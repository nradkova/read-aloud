import { useEffect, useContext } from "react";

import './index.css';

import AuthContext from "../../../context/authContext";
import useEventSearch from "../../../hooks/useEventSearch";

import Title from "../../../components/title";
import Loader from "../../../components/loader";
import EventCardMedium from "../../../components/medium-event-card";

const Events = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const {
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
  } = useEventSearch(user.username)


  useEffect(() => {
    requestCountHandler();
  }, [query]);

  useEffect(() => {
    if (pagination.count > 0) {
      requestDataHandler();
    }
  }, [pagination]);


  const searchMyEvents = (
    <div className="search-my-events">
      <div className="search-my-events-icon">
        <i className="far fa-calendar-check"></i>
        <span className="search-my-events-action" onClick={onClickMyEventsHandler} >MY EVENTS</span>
      </div>
    </div>
  )

  const searchAllEvents = (
    <div className="search-all-events">
      <div className="search-all-events-icon">
        <i className="far fa-calendar-check"></i>
        <span className="search-all-events-action" onClick={onClickAllEventsHandler} >ALL EVENTS</span>
      </div>
    </div>
  )

  const searchActiveEvents = (
    <div className="search-all-events">
      <div className="search-all-events-icon">
        <i className="far fa-calendar-check"></i>
        <span className="search-all-events-action" onClick={onClickActiveEventsHandler} >ACTIVE EVENTS</span>
      </div>
    </div>
  )

  const searchCancelledEvents = (
    <div className="search-all-events">
      <div className="search-all-events-icon">
        <i className="far fa-calendar-check"></i>
        <span className="search-all-events-action" onClick={onClickCancelledEventsHandler} >CANCELLED EVENTS</span>
      </div>
    </div>
  )

  const searchResults = (
    <>
      {query.all && <p className="search-message">Latest events...</p>}
      {!query.all && searchMessage.criteria && <p className="search-message">Found &nbsp; <strong>{pagination.count}</strong>	&nbsp; search results for	&nbsp; <strong>{searchMessage.search}</strong>	&nbsp; in 	&nbsp;<strong>{searchMessage.criteria}</strong>	&nbsp;</p>}
      <div className="events-container search">
        <button className="prev-events" disabled={isDisabledDecreaseButton} onClick={decreaseCounter}>&#10094;</button>
        <div className="events-inner-container">
          {events.map(x => <EventCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} name={x.name} createdAt={x.createdAt} date={x.date} status={x.status} />)}
        </div>
        <button className="next-events" disabled={isDisabledIncreaseButton} onClick={increaseCounter}>&#10095;</button>
      </div>
      <p className="search-pages">{(pagination.totalPages === 0 ? pagination.counter - 1 : pagination.counter)}/{pagination.totalPages}</p>
    </>
  )

  return (
      <>
      <Title title="EVENTS" />
      <div className="search-events">
        {searchAllEvents}
        {searchActiveEvents}
        {searchCancelledEvents}
        {isAuthenticated && searchMyEvents}
      </div>
      <div className="all-events-container">
        {isLoading ? <Loader /> : searchResults}
      </div>
      </>
  )
}

export default Events;