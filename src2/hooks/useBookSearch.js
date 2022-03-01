import {useState } from "react";

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

let isDisabledIncreaseButton=true;
let isDisabledDecreaseButton=true;

let searchMessage={
    criteria:null,
    search:null
}

const useBookSearch = (username) => {
    const [query, setQuery] = useState({all:true});
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({ counter: 1, perPage: 2, totalPages: 0, count: 0 });
    const [isLoading, setIsloading] = useState(false);
    const [validationError, setValidationError] = useState(null);

    const requestCountHandler = async () => {

        setIsloading(true);
        let count = 0;
        if (query.all) {
            count = await getAllBooksCount();
        }
        if (query.myPosts) {
            count = await getBooksByCreatorCount(query.myPosts);
        }
        if (query.postedBy) {
            count = await getBooksByCreatorCount(query.postedBy);
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
        if(totalPages<=1){
            isDisabledIncreaseButton=true;
            isDisabledDecreaseButton=true;
        }
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
            books = await getAllBooks(pagination);
        }
        if (query.myPosts) {
            books = await getBooksByCreator(pagination, query.myPosts);
        }
        if (query.postedBy) {
            books = await getBooksByCreator(pagination, query.postedBy);
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

        setIsloading(false);
        setBooks(books);
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
        setValidationError(null);
        setPagination(prev => ({ ...prev, counter:1 }));
        setQuery({myPosts:username});
        searchMessage={ criteria: username + ' profile', search: 'books' };

    }

    const onClickAllPostsHandler = async () => {
        setValidationError(null);
        setPagination(prev => ({ ...prev, counter:1 }));
        setQuery({all:true});
        searchMessage.criteria=null;
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
        setQuery({[criteria]:search});

        if (criteria === 'postedBy') {
            searchMessage={ criteria: 'users', search };
        }
        if (criteria === 'category') {
            searchMessage={ criteria: 'books categories', search };
        }
        if (criteria === 'author') {
            searchMessage={ criteria: 'books authors', search };
        }
        if (criteria === 'title') {
            searchMessage={ criteria: 'books titles', search };
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
        isDisabledIncreaseButton,
        isDisabledDecreaseButton,
        decreaseCounter,
        increaseCounter,
        onClickMyPostsHandler,
        onClickAllPostsHandler,
        onSubmitSearchHandler,
        requestCountHandler,
        requestDataHandler,
    }
}

export default useBookSearch;
