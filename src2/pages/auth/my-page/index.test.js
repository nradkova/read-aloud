import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


import MyPage from '.'
import AuthContextProvider from '../../../AuthContextProvider';
import NotificationContextProvider from '../../../NotificationContextProvider';

import authServices from '../../../services/user';
import { getMySubscriptions } from '../../../services/subscription';

jest.mock('../../../services/user');
jest.mock('../../../services/subscription');

function renderMyPage(user,notification){
  return  render(
    <AuthContextProvider value={user}>
      <NotificationContextProvider value={notification}>
        <BrowserRouter>
          <MyPage />
        </BrowserRouter>)
      </NotificationContextProvider>
    </AuthContextProvider>);
}


describe('MyPage component', () => {
  test('correct rendering of page text', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));

    expect(screen.getByText(/post new book/i)).toBeInTheDocument();
    expect(screen.getByText(/post new event/i)).toBeInTheDocument();
    expect(screen.getByText(/event schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/reading list/i)).toBeInTheDocument();
  });

  test('correct calculating page counters for user readings and events lists', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));

    expect(document.querySelector('.my-page-reading-list-items-container').nextElementSibling.textContent).toBe('1/3');
    expect(document.querySelector('.my-page-events-list-items-container').nextElementSibling.textContent).toBe('1/2');
  });

  test('displaying empty user lists messages', async () => {
    authServices.getUserReadingList.mockResolvedValue([]);
    getMySubscriptions.mockResolvedValue([]);
    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));

    expect(document.querySelector('.empty-reading-list').textContent).toBe('You have not added anything to your reading list yet.');
    expect(document.querySelector('.empty-events-list').textContent).toBe('You have not added anything to your event list yet.');
  });

  test('increase page buttons to be enabled', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));

    expect(document.querySelector('.my-page-events-list-items-container .next')).toBeEnabled();
    expect(document.querySelector('.my-page-reading-list-items-container .next')).toBeEnabled();
  });

  test('decrease page buttons to be disabled', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));

    expect(document.querySelector('.my-page-events-list-items-container .prev')).toBeDisabled();
    expect(document.querySelector('.my-page-reading-list-items-container .prev')).toBeDisabled();
  });

  test('render next page of events list by clicking increase button', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));
    fireEvent.click(document.querySelector('.my-page-events-list-items-container .next'));

    expect(document.querySelector('.my-page-events-list-items-container').nextElementSibling.textContent).toBe('2/2');
  });

  test('render next page of readings list by clicking increase button', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));
    fireEvent.click(document.querySelector('.my-page-reading-list-items-container .next'));

    expect(document.querySelector('.my-page-reading-list-items-container').nextElementSibling.textContent).toBe('2/3');
  });

  test('render previous page of events list by clicking increase button', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1},{subscriptionId:2},{subscriptionId:3},{subscriptionId:4}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));
    fireEvent.click(document.querySelector('.my-page-events-list-items-container .next'));
    fireEvent.click(document.querySelector('.my-page-events-list-items-container .prev'));

    expect(document.querySelector('.my-page-events-list-items-container').nextElementSibling.textContent).toBe('1/2');
  });

  test('render previous page of readings list by clicking increase button', async () => {
    authServices.getUserReadingList.mockResolvedValue([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    getMySubscriptions.mockResolvedValue([{subscriptionId:1}]);

    renderMyPage({username:'bbb'},{});

    await waitFor(() => screen.getByText(/s page/i));
    fireEvent.click(document.querySelector('.my-page-reading-list-items-container .next'));
    fireEvent.click(document.querySelector('.my-page-reading-list-items-container .prev'));

    expect(document.querySelector('.my-page-reading-list-items-container').nextElementSibling.textContent).toBe('1/3');
  });
});
