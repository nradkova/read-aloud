import { Link } from 'react-router-dom'

import './index.css'

const NavLink = ({ title, href, type }) => {
  return (
    <div  className={`${type}-list-item`}>
      <Link to={href} className={`${type}-link`}>
        {title}
      </Link>
    </div>
  )
}

export default NavLink;
