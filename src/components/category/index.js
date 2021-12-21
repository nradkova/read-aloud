import './index.css';
import { DEFAULT_BOOK_CATEGORIES } from '../../common';

const Category = ({ selectedCategories }) => {
    const categories = DEFAULT_BOOK_CATEGORIES;

    const onChangeSelectedHandler = (e) => {
        const index=selectedCategories.indexOf(e.target.name)
        if (index===-1) {
            selectedCategories.push(e.target.name)
        }else{
            selectedCategories.splice(index,1);
        }
    }
    
    return (
        <div className="category-container">
            {categories.map((x, i) => (
                <label key={x} className="checkbox-label" >{x}
                    <input className="category-input" type="checkbox" id={i} name={x} onChange={onChangeSelectedHandler} />
                    <span className="checkmark"></span>
                </label>
            ))}
        </div >
    )
}

export default Category;