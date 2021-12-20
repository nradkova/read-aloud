import './index.css'

const ValidationError = ({ message }) => {
  return (
    <p className="validation-error">{message}</p>
  )
}

export default ValidationError;