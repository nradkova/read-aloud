import { screen, render} from '@testing-library/react';
import { BrowserRouter} from 'react-router-dom';

import Header from './index.js';
import getNavigation from '../../utils/navigation';

jest.mock('../../utils/navigation');

describe('Header component', () => {
  test('rendering of unauthorised links', () => {
    const guestLinks = [
      {
        title: "Login",
        link: "/login"
      }
    ];

    getNavigation.mockReturnValue(guestLinks);
    render(<BrowserRouter>
      <Header />
    </BrowserRouter>);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('rendering of authorised links', () => {
    const authLinks = [
      {
        title: "My Page",
        link: '/my-page/aaa'
      }
    ];

    getNavigation.mockReturnValue(authLinks);
    render(<BrowserRouter>
      <Header />
    </BrowserRouter>);

    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  test('rendering of correct date', () => {
    const date = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    const guestLinks = [
      {
        title: "Login",
        link: "/login"
      }
    ];

    getNavigation.mockReturnValue(guestLinks);
    render(<BrowserRouter>
      <Header />
    </BrowserRouter>);
    expect(screen.getByText(date)).toBeInTheDocument();
  });
});