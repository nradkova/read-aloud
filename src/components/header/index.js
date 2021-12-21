import { useContext, useEffect, useState } from 'react';

import './index.css'

import getNavigation from '../../utils/navigation'
import AuthContext from '../../context/authContext';

import Link from '../nav-link'
import LogoLink from '../logo-link';


const Header = () => {
  const { user,isAuthenticated } = useContext(AuthContext);
  const [links, setLinks] = useState([])

  useEffect(() => {
    setLinks(getNavigation(isAuthenticated, user))
  }, [user])
  
  const date = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="header-wrapper">
      <div className="logo-container-header">
        <span className="logo-header">
          <LogoLink href="/home" className="logo-link">{<img alt="logo" className="logo-img-header" src="/read-aloud/logo.png" />}</LogoLink>
        </span>
        <div className="text-header">
          <span className="read-aloud">&gt;&gt;&gt; read aloud &lt;&lt;&lt;</span>
          <span>{date}</span>
        </div>
      </div>
      <div className="links-container">
        {
          links.map(x => {
            return (
              <Link
                key={x.title}
                href={x.link}
                title={x.title}
                type="header"
              />
            )
          })
        }
      </div>
    </header>
  )
}
export default Header;