import { useCallback, useRef } from 'react';

import './index.css';


const onClickHandler = (e) => {
  window.scrollTo({top: 0, behavior: "smooth"});
}

const scrollToTop = () => {
  if (window.scrollY > 0) {
    window.scrollTo({top: 0, behavior: "smooth"});
  }
}

const Scroller = () => {
  const scroller = useRef()
  
  useCallback(()=>{
    scrollToTop();

  },[])
  
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
