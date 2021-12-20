import { useEffect, useState } from "react";

import {
    getAllBooks,
    getAllBooksCount,
    getBooksByAuthor,
    getBooksByAuthorCount,
    getBooksByCategory,
    getBooksByCategoryCount,
    getBooksByTitle,
    getBooksByTitleCount,
    getBooksByCreator,
    getBooksByCreatorCount
} from "../services/book";

import { searchDataValidation } from "../utils/validation";

const queryParams={
    all:true,
    myPosts:false,
    title:null,
    author:null,
    category:null,
    postedBy:null
}

let isDisabledIncreaseButton=true;
let isDisabledDecreaseButton=true;


const useBookSearch = (username) => {
    const [query, setQuery] = useState(queryParams);
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({ counter: 1, perPage: 3, totalPages: 0, count: 0 });
    const [isLoading, setIsloading] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [searchMessage, setSearchMessage] = useState(null);

    const requestCountHandler = async () => {
        setIsloading(true);
        let count = 0;
        if (query.all) {
            count = await getAllBooksCount();
        }
        if (query.myPosts) {
            count = await getBooksByCreatorCount(query.myPosts);
        }
        if (query.creator) {
            count = await getBooksByCreatorCount(query.creator);
        }
        if (query.category) {
            count = await getBooksByCategoryCount(query.category);
        }
        if (query.author) {
            count = await getBooksByAuthorCount(query.author);
        }
        if (query.title) {
            count = await getBooksByTitleCount(query.title);
        }
        const totalPages = Math.ceil(count / pagination.perPage);
        if(totalPages>1){
            isDisabledIncreaseButton=false;
        }
        setPagination(prev => ({ ...prev, count, totalPages }));
        setIsloading(false);
    }

    const requestDataHandler = async () => {
        setIsloading(true);
        let books = [];
        if (query.all) {
            console.log(pagination);
            books = await getAllBooks(pagination);
        }
        if (query.myPosts) {
            books = await getBooksByCreator(pagination, query.myPosts);
        }
        if (query.creator) {
            books = await getBooksByCreator(pagination, query.creator);
        }
        if (query.category) {
            books = await getBooksByCategory(pagination, query.category);
        }
        if (query.author) {
            books = await getBooksByAuthor(pagination, query.author);
        }
        if (query.title) {
            books = await getBooksByTitle(pagination, query.title);
        }
        setBooks(books);
        setIsloading(false);

    }
    
    const increaseCounter = () => {
        const counter = pagination.counter + 1;
        if (counter >= pagination.totalPages) {
            isDisabledIncreaseButton=true;
        }
            isDisabledDecreaseButton=false;
        setPagination(prev => ({ ...prev, counter:counter }));
    }

    const decreaseCounter = () => {
        const counter = pagination.counter - 1;
        if (counter === 1) {
            isDisabledDecreaseButton=true;
        }
            isDisabledIncreaseButton=false;
        setPagination(prev => ({ ...prev, counter:counter }));
    }


    const onClickMyPostsHandler = async () => {
        setPagination(prev => ({ ...prev, counter:1 }));
        setQuery(prev=>({...prev,'myPosts':username,'all':null}));
        setSearchMessage({ criteria: username + ' profile', search: 'books' });
    }


    const onSubmitSearchHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');
        const criteria = formData.get('criteria');
        const error = searchDataValidation(criteria, search);

        setValidationError(error);
        if (error) {
            return;
        }
        setPagination(prev => ({ ...prev, counter:1 }));
        setQuery(prev=>({...prev,[criteria]:search,'all':null}));
        if (criteria === 'postedBy') {
            setSearchMessage({ criteria: 'users', search });
        }
        if (criteria === 'category') {
            setSearchMessage({ criteria: 'books categories', search });
        }
        if (criteria === 'author') {
            setSearchMessage({ criteria: 'books authors', search });
        }
        if (criteria === 'title') {
            setSearchMessage({ criteria: 'books titles', search });
        }
        e.target.reset();
    }
    
    return {
        query,
        books,
        pagination,
        isLoading,
        validationError,
        searchMessage,
        decreaseCounter,
        increaseCounter,
        isDisabledIncreaseButton,
        isDisabledDecreaseButton,
        onClickMyPostsHandler,
        onSubmitSearchHandler,
        requestCountHandler,
        requestDataHandler,
    }
}

export default useBookSearch;