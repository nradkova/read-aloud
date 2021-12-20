import { useRef } from 'react';

import './index.css';

const onClickHandler = (e) => {
  window.scrollTo(0, 0)
}

const scrollToTop = () => {
  if (window.scrollY > 0) {
    window.scrollTo(0, 0);
  }
}

const Scroller = () => {
  const scroller = useRef()
  
  scrollToTop();
  
  const setVisible = () => {
    if (window.innerHeight + 300 >= window.outerHeight) {
      if (scroller.current) {
        scroller.current.style.display = "block";
      }
    }
  }

  window.addEventListener('scroll', setVisible);
  
  return (
    <button ref={scroller} className={`scroller-button`} onClick={onClickHandler}><i className="fas fa-arrow-up"></i></button>
  )
}

export default Scroller;