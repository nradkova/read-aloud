import { render} from '@testing-library/react';

import CustomComment from './index.js';

describe('CustomComment component',()=>{
  test('rendering of comment creator', () => {
    render(<CustomComment creator={'aaa'} />);
         
    expect(document.querySelector('.comment-author span').textContent).toBe('aaa');
  });

  test('rendering of comment text', () => {
    render(<CustomComment text={'aaa'} />);
         
    expect(document.querySelector('.comment-text').textContent).toBe('aaa');
  });

  test('rendering of comment date', () => {
    const dateString=Date.now().toString();
    render(<CustomComment createdAt={dateString} />);
    expect(document.querySelector('.comment-date').textContent).toBe(dateString);
  });
})