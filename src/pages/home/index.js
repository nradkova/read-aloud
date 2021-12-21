import { useState, useEffect } from "react";

import './index.css';

import { getLastFourBooks, getMostLikedBooks } from "../../services/book";
import { getLastFourEvents, getMostRecentEvents } from "../../services/event";

import Loader from "../../components/loader";
import PageLayout from "../../components/page-layout";
import BookCardMedium from "../../components/book-card-medium";
import EventCardMedium from "../../components/medium-event-card";



const Home = () => {
  const [books, setBooks] = useState([])
  const [events, setEvents] = useState([])
  const [isLoading, setIsloading] = useState(false);
  const [labelLatestBooks, setLabelLatestBooks] = useState('selected');
  const [labelLikedBooks, setLabelLikedBooks] = useState('');
  const [labelUpcomingEvents, setLabelUpcomingEvents] = useState('selected');
  const [labelNewestEvents, setLabelNewestEvents] = useState('');

  useEffect(() => {
    setIsloading(true);
    latestBooksHandler();
    setLabelLatestBooks('selected');
    newestEventHandler();
    setLabelUpcomingEvents('selected');
    setIsloading(false);
  }, [])


  const mostLikedBooksHandler = async () => {
    setIsloading(true);
    const res = await getMostLikedBooks();
    setIsloading(false);
    setBooks(res);
    setLabelLikedBooks('selected');
    setLabelLatestBooks('');
  }

  const latestBooksHandler = async () => {
    setIsloading(true);
    const res = await getLastFourBooks();
    setIsloading(false);
    setBooks(res);
    setLabelLatestBooks('selected');
    setLabelLikedBooks('');
  }

  const newestEventHandler = async () => {
    setIsloading(true);
    const res = await getLastFourEvents();
    setIsloading(false);
    setEvents(res);
    setLabelNewestEvents('selected');
    setLabelUpcomingEvents('');
  }

  const upcomingEventsHandler = async () => {
    setIsloading(true);
    const res = await getMostRecentEvents();
    setIsloading(false);
    setEvents(res);
    setLabelUpcomingEvents('selected');
    setLabelNewestEvents('');
  }

  const pageIntro = (
    <div className="inner-container">
      <section className="inner-container-text">
        <h3>READING IS AN EMOTION THAT CAN BE SHARED.</h3>
        <h1 className="read-aloud-header">&gt;&gt;&gt; read aloud &lt;&lt;&lt; </h1>
        <h3> IS A PLACE TO </h3>
        <h3> PRESENT YOUR FAVOURITE BOOKS AND FIND FRIENDS.</h3>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus nulla sequi ipsam modi quas doloribus a impedit quibusdam id numquam officia commodi voluptate maxime nihil assumenda temporibus, voluptatem accusantium minus?
      </section>
      <section className="inner-container-img">
        <img src="/read-aloud/reading-time.jpg" alt="Reading Time" />
      </section>
    </div>
  )

  if (isLoading) {
    return (
      <PageLayout>
        {pageIntro}
        <Loader />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {pageIntro}
      <div className="inner-container-books-events">
        <section className="inner-container-books">
          <div className="books-container">
            {books.map(x => <BookCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} title={x.title} author={x.author} rating={x.rating} />)}
          </div>
          {books.length > 0
            ? <div className="label-container">
              <p className={`label ${labelLatestBooks}`} onClick={latestBooksHandler}>LATEST BOOKS</p>
              <p className={`label ${labelLikedBooks}`} onClick={mostLikedBooksHandler}>MOST LIKED BOOKS</p>
            </div>
            : <h3>No books yet...</h3>
          }
        </section>
        <section className="inner-container-events">
          <div className="events-container">
            {events.map(x => <EventCardMedium key={x.id} id={x.id} imageUrl={x.imageUrl} name={x.name} createdAt={x.createdAt} date={x.date} status={x.status} />)}
          </div>
          {events.length > 0
            ? <div className="label-container">
              <p className={`label ${labelNewestEvents}`} onClick={newestEventHandler} >NEWEST EVENTS</p>
              <p className={`label ${labelUpcomingEvents}`} onClick={upcomingEventsHandler}>UPCOMING EVENTS</p>
            </div>
            : <h3>No events yet...</h3>
          }
        </section>
      </div>
    </PageLayout>
  )
}

export default Home;