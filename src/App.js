import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';

import { AuthRoute, UserRoute } from './GuardedRoute';

import Home from './pages/home';
import Landing from './pages/landing';
import NoMatch from './pages/no-match';
import Books from './pages/book/books';
import Login from './pages/auth/login';
import Logout from './pages/auth/logout';
import Events from './pages/event/events';
import MyPage from './pages/auth/my-page';
import Register from './pages/auth/register';
import BookEdit from './pages/book/book-edit';
import EventEdit from './pages/event/event-edit';
import BookCreate from './pages/book/book-create';
import PageLayout from './components/page-layout';
import BookDetails from './pages/book/book-details';
import EventCreate from './pages/event/event-create';
import EventDetails from './pages/event/event-details';


const App = () => {
  const location = useLocation();
  
  if (location.pathname === '/') {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    )
  }

  return (
    <PageLayout>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/books" element={<Books />} />
        <Route path="/books/:bookId" element={<BookDetails />} />
        <Route element={<AuthRoute />}>
          <Route path="/books/:bookId/edit" element={<BookEdit />} />
          <Route path="/books/create" element={<BookCreate />} />
        </Route>

        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route element={<AuthRoute />}>
          <Route path="/events/:eventId/edit" element={<EventEdit />} />
          <Route path="/events/create" element={<EventCreate />} />
        </Route>

        <Route element={<UserRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/my-page/:userId" element={<MyPage />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
