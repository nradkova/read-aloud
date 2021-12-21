import { Link } from 'react-router-dom';

import './index.css';

const LogoLink = (props) => {
  return (
    <Link to="/home"  >
      {props.children}
    </Link>
  )
}

export default LogoLink;