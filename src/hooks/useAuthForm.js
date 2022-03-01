import { useState } from 'react';

import { INITIAL_AUTH_VALIDATION_ERROR, INITIAL_AUTH_VALUE, INITIAL_USER_FORM_VALUE } from '../constants/common';

import userService from '../services/user';
import { userDataValidation } from '../utils/validation';


function useAuthForm() {

    const [formValue, setFormValue] = useState(INITIAL_USER_FORM_VALUE);
    const [authValue, setAuthValue] = useState(INITIAL_AUTH_VALUE);
    const [isLoading, setIsloading] = useState(false);
    const [validationError, setValidationError] = useState(INITIAL_AUTH_VALIDATION_ERROR);
    const [isSuccess, setIsSuccess] = useState(false);


    const onChangeInputHandler = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const type = e.target.name;
        if (validationError.exists) {
            setValidationError(prev => ({ ...prev, "exists": null }))
        }
        const error = userDataValidation(type, value, formValue.password);
        setValidationError(prev => ({ ...prev, [type]: error }));
        if (error) {
            return;
        }
        setFormValue(prev => ({ ...prev, [type]: value }))
    }

    const onSubmitUserRegisterHandler = (e) => {
        e.preventDefault();

        const data = new FormData(e.target)
        const user = {
            username: data.get('username'),
            password: data.get('password'),
            rePass: data.get('rePass')
        }

        if (validationError.username || validationError.password || validationError.rePass) {
            return;
        }
        if (user.username === '' || user.password === '' || user.rePass === '') {
            return;
        }

        async function requestHandler() {
            try {
                setIsloading(true);
                const isExisting = await doesUserExist(user.username);
                if (isExisting) {
                    setIsloading(false);
                    return;
                }
                const res = await userService.register(user);
                setAuthValue(res);
                setIsloading(false);
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
            }
        }
        requestHandler();
    }

    const onSubmitUserLoginHandler = (e) => {
        e.preventDefault();

        const data = new FormData(e.target)
        const user = {
            username: data.get('username'),
            password: data.get('password')
        }

        if (validationError.username || validationError.password) {
            return;
        }
        if (user.username==='' || user.password==='') {
            return;
        }

        userService.login(user)
            .then(user => {
                setIsloading(true);
                setAuthValue(user);
                setIsloading(false);
                setIsSuccess(true);
            })
            .catch(err => {
                if (err.message === 'Invalid username/password.') {
                    setValidationError(prev => ({ ...prev, "credentials": err.message }))
                    return;
                }
            })
    }
    
    const doesUserExist = async (username) => {
        try {
            const res = await userService.checkUserExists(username);
            if (res) {
                setFormValue({ username: username })
                setValidationError(prev => ({ ...prev, "exists": "User with such name already exists. Please sign up with another name." }));
                return true;
            }
            setValidationError(prev => ({ ...prev, "exists": null }));
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        formValue,
        authValue,
        isLoading,
        validationError,
        isSuccess,
        onChangeInputHandler,
        onSubmitUserRegisterHandler,
        onSubmitUserLoginHandler,
    };
}

export default useAuthForm;