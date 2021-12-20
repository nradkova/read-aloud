import './index.css'

const Input=({id,label,value,onChange,type})=>{
    return(
        <div>
            <label htmlFor={id}>{label} :</label>
            <input type={type || "text"} value={value || ""} onChange={onChange}/>
        </div>
    )
}

export default Input;