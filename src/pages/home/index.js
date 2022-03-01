import { useEffect, useReducer } from "react";

import './index.css';

import { getLastFourBooks, getMostLikedBooks } from "../../services/book";
import { getLastFourEvents, getMostRecentEvents } from "../../services/event";

import Loader from "../../components/loader";
import BookCardMedium from "../../components/book-card-medium";
import EventCardMedium from "../../components/medium-event-card";

const initState = {
  books: [],
  events: [],
  labelLatestBooks: 'selected',
  labelLikedBooks: '',
  labelUpcomingEvents: 'selected',
  labelNewestEvents: '',
  isLoading: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'books':
      return { ...state, books: action.payload };
    case 'events':
      return { ...state, events: action.payload };
    case 'latestBooks':
      return { ...state, labelLatestBooks: 'selected', labelLikedBooks: '' };
    case 'likedBooks':
      return { ...state, labelLikedBooks: 'selected', labelLatestBooks: '' };
    case 'upcomingEvents':
      return { ...state, labelUpcomingEvents: 'selected', labelNewestEvents: '' };
    case 'newestEvents':
      return { ...state, labelUpcomingEvents: '', labelNewestEvents: 'selected' };
    case 'loading':
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
}



const Home = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    latestBooksHandler();
    newestEventHandler();
  }, [])


  const mostLikedBooksHandler = async () => {
    dispatch({ type: 'loading' });
    const res = await getMostLikedBooks();
    dispatch({ type: 'loading' });
    dispatch({ type: 'books', payload: res });
    dispatch({ type: 'likedBooks' });

  }

  const latestBooksHandler = async () => {
    dispatch({ type: 'loading' });
    const res = await getLastFourBooks();
    dispatch({ type: 'loading' });
    dispatch({ type: 'books', payload: res });
    dispatch({ type: 'latestBooks' });
  }

  const newestEventHandler = async () => {
    dispatch({ type: 'loading' });
    const res = await getLastFourEvents();
    dispatch({ type: 'loading' });
    dispatch({ type: 'events', payload: res });
    dispatch({ type: 'newestEvents' });
  }

  const upcomingEventsHandler = async () => {
    dispatch({ type: 'loading' });
    const res = await getMostRecentEvents();
    dispatch({ type: 'loading' });
    dispatch({ type: 'events', payload: res });
    dispatch({ type: 'upcomingEvents' });
  }

  const pageIntro = (
    <div className="inner-container">
      <section className="inner-container-text">
        <h3>READING IS AN EMOTION THAT CAN BE SHARED.</h3>
        <h1 className="read-aloud-header">&gt;&gt;&gt; read aloud &lt;&lt;&lt; </h1>
        <h3> IS A PLACE TO </h3>
        <h3> PRESENT YOUR FAVOURITE BOOKS AND FIND FRIENDS.</h3>
        <h3>Read Aloud is a social platform, where users publish posts about books, they love. Events on different themes are organised in order to join people with similar interests and hobbies.Everyone is welcomed. There is only one condition - to love reading.</h3>
      </section>
      <section className="inner-container-img">
        <img src="/read-aloud/reading-time.jpg" alt="Reading Time" />
      </section>
    </div>
  )

  if (state.isLoading) {
    return (
      <>
        {pageIntro}
        <Loader />
      </>
    )
  }

  return (
    <>
      {pageIntro}
      <div className="inner-container-books-events">
        <section className="inner-container-books">
          <div className="books-container-items">
            {state.books.map(x => <BookCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} rating={x.rating} />)}
          </div>
          {state.books.length > 0
            ? <div className="label-container">
              <p className={`label ${state.labelLatestBooks}`} onClick={latestBooksHandler}>LATEST BOOKS</p>
              <p className={`label ${state.labelLikedBooks}`} onClick={mostLikedBooksHandler}>MOST LIKED BOOKS</p>
            </div>
            : <h3>No books yet...</h3>
          }
        </section>
        <section className="inner-container-events">
          <div className="events-container-items">
            {state.events.map(x => <EventCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} name={x.name} createdAt={x.createdAt} date={x.date} status={x.status} />)}
          </div>
          {state.events.length > 0
            ? <div className="label-container">
              <p className={`label ${state.labelNewestEvents}`} onClick={newestEventHandler} >NEWEST EVENTS</p>
              <p className={`label ${state.labelUpcomingEvents}`} onClick={upcomingEventsHandler}>UPCOMING EVENTS</p>
            </div>
            : <h3>No events yet...</h3>
          }
        </section>
      </div>
    </>
  )
}

export default Home;
