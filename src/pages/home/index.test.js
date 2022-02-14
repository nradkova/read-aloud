import { render, screen, waitFor, fireEvent} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


import Home from '.';

import { getLastFourBooks, getMostLikedBooks } from '../../services/book';
import { getLastFourEvents, getMostRecentEvents } from '../../services/event';

jest.mock('../../services/book');
jest.mock('../../services/event');

function renderHomePage() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>);
};


describe('Home component', () => {
  test('correct rendering of page text', async () => {
    getLastFourBooks.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    getLastFourEvents.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

    renderHomePage();

    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));

    expect(screen.getByText(/LATEST BOOKS/i)).toBeInTheDocument();
    expect(screen.getByText(/MOST LIKED BOOKS/i)).toBeInTheDocument();
    expect(screen.getByText(/NEWEST EVENTS/i)).toBeInTheDocument();
    expect(screen.getByText(/UPCOMING EVENTS/i)).toBeInTheDocument();
  });

  test('displaying empty collections messages', async () => {
    getLastFourBooks.mockResolvedValue([]);
    getLastFourEvents.mockResolvedValue([]);

    renderHomePage();

    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));

    expect(document.querySelector('.inner-container-events h3').textContent).toBe('No events yet...');
    expect(document.querySelector('.inner-container-books h3').textContent).toBe('No books yet...');
  });

  test('rendering most liked books selection', async () => {
    getLastFourBooks.mockResolvedValue([{id:1}]);
    getLastFourEvents.mockResolvedValue([{id:1}]);
    getMostLikedBooks.mockResolvedValue([{ id: 1, title: 'aaa' }]);
    renderHomePage();
    
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-books .label-container :last-child'));

    await waitFor(() => expect(screen.getByText('aaa')).toBeInTheDocument());
  });

  test('rendering most recent events selection', async () => {
    getLastFourBooks.mockResolvedValue([{id:1}]);
    getLastFourEvents.mockResolvedValue([{id:1}]);
    getMostRecentEvents.mockResolvedValue([{ id: 1, name: 'aaa' }]);
    renderHomePage();
    
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-events .label-container :last-child'));
    
    await waitFor(() => expect(screen.getByText('aaa')).toBeInTheDocument());
  });

  test('rerendering last four books selection', async () => {
    getLastFourBooks.mockResolvedValue([{id:1,title:'bbb'}]);
    getLastFourEvents.mockResolvedValue([{id:1}]);
    getMostLikedBooks.mockResolvedValue([{ id: 1, title: 'aaa' }]);
    renderHomePage();
    
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-books .label-container :last-child'));
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-books .label-container p'));

    await waitFor(() => expect(screen.getByText('bbb')).toBeInTheDocument());
  });

  test('rerendering last four events selection', async () => {
    getLastFourBooks.mockResolvedValue([{id:1}]);
    getLastFourEvents.mockResolvedValue([{id:1,name:'bbb'}]);
    getMostRecentEvents.mockResolvedValue([{ id: 1, name: 'aaa' }]);
    renderHomePage();
    
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-events .label-container :last-child'));
    await waitFor(() => screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i));
    fireEvent.click(document.querySelector('.inner-container-events .label-container p'));

    await waitFor(() => expect(screen.getByText('bbb')).toBeInTheDocument());
  });
});
