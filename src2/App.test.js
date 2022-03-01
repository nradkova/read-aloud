import { render, screen,fireEvent} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

describe('App component',()=>{
  test('initial rendering of greeting text', () => {
    render(<BrowserRouter>
              <App />
          </BrowserRouter>);
    const greeting = screen.getByText(/you love reading/i);
    expect(greeting).toBeInTheDocument();
  });
  test('initial rendering of enter link', () => {
    render(<BrowserRouter>
              <App />
          </BrowserRouter>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
  test('clicking on enter link redirects to home page', () => {
    render(<BrowserRouter>
              <App />
          </BrowserRouter>);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    const homePageGreeting = screen.getByText(/READING IS AN EMOTION THAT CAN BE SHARED/i);
    expect(homePageGreeting).toBeInTheDocument();
  });
})
