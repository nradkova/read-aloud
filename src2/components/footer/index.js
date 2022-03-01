import './index.css';

import LogoLink from '../logo-link';


const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="logo-container-footer" >
        <span className="logo-footer">
          <LogoLink href="/home">{<img alt="logo" className="logo-img-footer" src="/read-aloud/logo.png" />}</LogoLink>
        </span>
        <span className="text-footer">READ ALOUD &copy; 2021</span>
      </div>
      <p>Designed and created by nradkova</p>
    </footer>
  )
}
export default Footer;