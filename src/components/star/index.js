import './index.css';
import { MAX_DEFAULT_RATING } from '../../constants/common';

const Star = ({ rating }) => {
    
    const stars = Array(MAX_DEFAULT_RATING).fill(1);

    return (
        <>
            {stars.map((x, i) =>
                i < rating
                    ? (<span key={i} className="fa fa-star checked"></span>)
                    : (<span key={i} className="fa fa-star"></span>)
            )}
        </>
    )
}

export default Star;