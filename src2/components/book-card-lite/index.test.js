import { render} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import BookCardLite from './index.js';

describe('BookCardLite component',()=>{
  test('rendering of card title', () => {
    render(<BrowserRouter>
              <BookCardLite title={'aaa'} />
          </BrowserRouter>);
    const titleNode=document.querySelector('.book-card-lite-content-heading').parentNode;
    expect(titleNode.textContent).toBe(' Title: aaa');
  });

  test('rendering of card author', () => {
    render(<BrowserRouter>
              <BookCardLite author={'aaa'} />
          </BrowserRouter>);
    const authorNode=document.querySelectorAll('.book-card-lite-content-heading')[1].parentNode;
    expect(authorNode.textContent).toBe('  Author: aaa');
  });

  test('rendering of card id in view link', () => {
    render(<BrowserRouter>
              <BookCardLite bookId={'aaa'} />
          </BrowserRouter>);
    const link=document.querySelector('.details-link-lite');
    expect(link.getAttribute('href')).toBe('/books/aaa');
  });

  test('rendering of card and user id in remove link', () => {
    render(<BrowserRouter>
              <BookCardLite  bookId={'aaa'} userId={'bbb'} />
          </BrowserRouter>);
    const link=document.querySelector('.delete-link-lite');
    expect(link.getAttribute('href')).toBe('/my-page/bbb/book-remove/aaa');
  });
})