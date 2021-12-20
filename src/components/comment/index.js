import './index.css'

const CustomComment = ({creator, text, createdAt }) => {

    return (
        <div className="comment-container">
            <div className="comment-author">
                <i className="fas fa-user-circle"></i>
                <span>{creator}</span>
            </div>
            <p className="comment-date">{createdAt}</p>
            <div className="comment-text">
                {text}
            </div>
        </div>
    )
}

export default CustomComment;