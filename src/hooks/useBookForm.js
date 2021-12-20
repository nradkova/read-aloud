import { useState, useCallback } from 'react';

import { DEFAULT_BOOK_URL, INITIAL_BOOK_VALIDATION_ERROR, INITIAL_BOOK_VALUE } from '../common';

import uploadImage from '../services/image';
import { bookDataValidation } from '../utils/validation';
import { createBook, editBook, getBookById } from '../services/book';

const useBookForm = (categories) => {
    const [isLoading, setIsloading] = useState(false);
    const [isImageLoading, setIsImageloading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookValue, setBookValue] = useState(INITIAL_BOOK_VALUE);
    const [validationError, setValidationError] = useState(INITIAL_BOOK_VALIDATION_ERROR);
    const [imagePreview, setImagePreview] = useState(DEFAULT_BOOK_URL);


    const onSubmitBookCreateHandler = (e) => {
        e.preventDefault();

        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const data = new FormData(e.target)
        const book = {
            title: data.get('title'),
            author: data.get('author'),
            description: data.get('description'),
            category: categories,
            image: imagePreview
        }

        if (validationError.title || validationError.description 
            || validationError.image || validationError.author) {
            return;
        }
        if (book.title==='' || book.description ==='' || book.author==='') {
            setValidationError(prev=>({...prev,'required':'*Title, author and description are required.'}))
            return;
        }

        createBook(book)
            .then(res => {
                setIsloading(true);
                setBookValue(prev=>({...prev,res}));
                setIsSuccess(true);
            })
            .catch(err => console.log(err))

            bookFormReset();
    }

    const onSubmitBookEditHandler = (e) => {
        e.preventDefault();

        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const data = new FormData(e.target)
        const book = {
            title: data.get('title'),
            author: data.get('author'),
            description: data.get('description'),
            category: categories,
            image: imagePreview
        }

        if (validationError.title || validationError.description 
            || validationError.image || validationError.author) {
            return;
        }
        if (book.title==='' || book.description ==='' || book.author==='') {
            setValidationError(prev=>({...prev,'required':'*Title, author and description are required.'}))
            return;
        }

        editBook(bookValue.id,book)
            .then(res => {
                setIsloading(true);
                setBookValue(prev=>({...prev,res}));
                setIsSuccess(true);
            })
            .catch(err => console.log(err))

        bookFormReset();
    }

    const onBlurInputHandler = (e) => {
        const value = e.target.value;
        const type = e.target.name;
        
        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const error = bookDataValidation(type, value);
        setValidationError(prev => ({ ...prev, [type]: error }))
        if (error) {
            return;
        }
    }

    const onChangeInputHandler = (e) => {
        const value = e.target.value;
        const type = e.target.name;
        
        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const error = bookDataValidation(type, value);
        setValidationError(prev => ({ ...prev, [type]: error }))
        if (error) {
            return;
        }
    }

    const onChangeImageHandler = (e) => {
        const value = e.target.files[0];
        
        const error =bookDataValidation('imageUrl', (value || ''));
        setValidationError(prev => ({ ...prev, 'image': error }))
        if (error) {
            return;
        }
        if (!value) {
            setImagePreview(DEFAULT_BOOK_URL);
        } else {
            setIsImageloading(true);
            uploadImage(value)
                .then(url => {
                    setIsImageloading(false);
                    setImagePreview(url);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const setInitialBookEditValue = useCallback((bookId) => {
        setIsloading(true);
        getBookById(bookId)
        .then(res => {
            setBookValue(res);
            setImagePreview(res.imageUrl)
            setIsloading(false);
        })
        .catch(err => console.log(err))
    }, [])

    const bookFormReset = () => {
        setValidationError(INITIAL_BOOK_VALIDATION_ERROR);
        setIsloading(false);
        setIsSuccess(false);
        setBookValue(INITIAL_BOOK_VALUE);
        setImagePreview(DEFAULT_BOOK_URL);
    }

    return{
        bookValue,
        isLoading,
        isImageLoading,
        isSuccess,
        validationError,
        imagePreview,
        onChangeImageHandler,
        onBlurInputHandler,
        onChangeInputHandler,
        onSubmitBookCreateHandler,
        setInitialBookEditValue,
        onSubmitBookEditHandler
    }
}

export default useBookForm;