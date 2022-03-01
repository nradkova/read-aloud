import { Link } from 'react-router-dom';

import './index.css';


const Landing = () => {
    return (
        <div className="landing-page-wrapper">
            <div className="line-first">
                <p> You love reading...</p>
            </div>
            <div className="line-second">
                <p> Find other people who share your passion.</p>
            </div>
            <div className="line-third">
                <p> Join them.</p>
                <Link to='/home' ><i className="fas fa-book-reader"></i></Link>
            </div>
        </div>
    )
}

export default Landing;