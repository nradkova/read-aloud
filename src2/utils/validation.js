const userDataValidation = (type, value, check) => {
    if (type === "username") {
        if (value.trim().length < 5 || value.trim().length > 15) {
            return "Username must be between 5 and 15 characters long.";
        }
    }

    if (type === "password") {
        if (value.trim().length < 6 || value.trim().length > 12) {
            return "Password must be between 6 and 12 characters long.";
        }
    }

    if (type === "rePass") {
        if (value !== check) {
            return "Passwords don't match.";
        }
    }

    return null;
}

const bookDataValidation = (type, value) => {

    if (type === "title") {
        if (value.trim().length < 2) {
            return " Book title must be at least 2 characters."
        }
    }

    if (type === "author") {
        if (value.trim().length < 2 || value.trim() > 50) {
            return " Book author must  be between 2 and 50 characters."
        }
    }

    if (type === "description") {
        if (value.trim().length === 0) {
            return "Book description is required."
        }
        if (value.trim().length > 500) {
            return "Book description can be up to 500 characters."
        }
    }

    if (type === "imageUrl") {
        if (value.size > 0 && !value.type.includes("image")) {
            return "Choose images to upload (PNG, JPG, JPEG...)"
        }
    }

    return null;
}
const eventDataValidation = (type, value,month) => {

    if (type === "name") {
        if (value.trim().length < 2) {
            return " Event name must be at least 2 characters."
        }
    }

    if (type === "date") {
        const now = Date.now();
        if (!value || value.getFullYear()===1899||month==='') {
            return "Date is invalid."
        }
        if (now > value) {
            return "You have entered a past date."
        }
    }

    if (type === "description") {
        if (value.trim().length === 0) {
            return "Event description is required."
        }
        if (value.trim().length > 500) {
            return "Event description can be up to 500 characters."
        }
    }

    if (type === "imageUrl") {
        if (value.size > 0 && !value.type.includes("image")) {
            return "Choose images to upload (PNG, JPG, JPEG...)"
        }
    }

    return null;
}

const searchDataValidation = (criteria, value) => {
    if (!criteria || !value || criteria.trim() === "" || value.trim() === "") {
        return "Both search keys and criteria are required. E.g. 'The lord of the rings' and 'by 'title'"
    }
    return null;
}

const commentDataValidation = (value) => {
    if (value.trim().length === 0 || value.trim().length > 400) {
        return "*Your comment can not be 0 or more than 400 characters.";
    }
    return null;
}

export {
    userDataValidation,
    bookDataValidation,
    searchDataValidation,
    commentDataValidation,
    eventDataValidation
}
