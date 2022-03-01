import { useState} from 'react';

import './index.css';

const onClickHandler = (e) => {
  window.scrollTo({top: 0, behavior: "smooth"});
};

const Scroller = () => {
  const [visible, setVisible] = useState(false);
  
  const showScroller = () => {
      const scrolled = window.scrollY;
      if (scrolled > 150) {
          setVisible(true);
      } else if (scrolled <= 150) {
          setVisible(false);
      }
  };

    window.addEventListener('scroll', showScroller);
  
  return (
    <button className="scroller-button" style={{display:visible?'block':'none'}} onClick={onClickHandler}><i className="fas fa-arrow-up"></i></button>
  )
}

export default Scroller;
