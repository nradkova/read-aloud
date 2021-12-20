import { useState } from "react";

const useLocalStorage = (key, value) => {

    const [state, setState] = useState(()=>{
        try {
            const item = localStorage.getItem(key);
            console.log(item);
            if (item) {
                return JSON.parse(item)
            }
            return value;
        } catch (error) {
            console.log(error.message);
            return value;
        }
    })


    const setLocalStorageItem = (value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))

            setState(value);
        } catch (error) {
            console.log(error.message);
        }
    }

    return [
        state,
        setLocalStorageItem
    ]
};

export default useLocalStorage;