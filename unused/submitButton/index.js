import './index.css'
const SubmitButton = ({ title, onSubmit }) => {
    return (
      <button type="submit" onSubmit={onSubmit}>{title}</button>
    )
  }

  export default SubmitButton