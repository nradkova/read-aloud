import { Link } from "react-router-dom";

import './index.css';

const NoMatch = () => {
    return (
        <div className="no-match">
            <h2>Something went wrong!</h2>
            <p>
                <Link to="/home">Go to the home page</Link>
            </p>
        </div>
    );
}

export default NoMatch;