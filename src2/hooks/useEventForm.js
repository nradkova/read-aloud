import { useState, useCallback } from 'react';

import { DEFAULT_EVENT_URL, INITIAL_EVENT_VALUE, INITIAL_EVENT_VALIDATION_ERROR, DEFAULT_LAG_LTD } from '../common';

import uploadImage from '../services/image';
import { eventDataValidation } from '../utils/validation';
import { cancelEvent, createEvent, editEvent, getEventById } from '../services/event';


const useEventForm = (user) => {
    const [isLoading, setIsloading] = useState(false);
    const [isImageLoading, setIsImageloading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [point, setPoint] = useState(DEFAULT_LAG_LTD);
    const [eventValue, setEventValue] = useState(INITIAL_EVENT_VALUE);
    const[notCreator,setNotCreator]=useState(false);
    const [validationError, setValidationError] = useState(INITIAL_EVENT_VALIDATION_ERROR);
    const [imagePreview, setImagePreview] = useState(DEFAULT_EVENT_URL);

    const getGeoPoint = (point) => {
        setPoint(point);
    }

    const onSubmitEventCreateHandler = (e) => {
        e.preventDefault();

        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const data = new FormData(e.target);
        const event = dataParser(data);
        event.image = imagePreview;
        event.status = 'active';
        event.location = point;

        const dateError = eventDataValidation('date', event.date,data.get('month'));
        setValidationError(prev => ({ ...prev, 'date': dateError }));
       
        
        if (event.name === '' || event.description === ''
        || JSON.stringify(event.location) === JSON.stringify(DEFAULT_LAG_LTD)) {
            setValidationError(prev => ({ ...prev, 'required': '*Topic, description, date and location are required.' }))
            return;
        }
        
        if (validationError.name || validationError.description
            || validationError.image || dateError) {
            return;
        }
        createEvent(event)
            .then(res => {
                setIsloading(true);
                setEventValue(prev => ({ ...prev, res }));
                setIsSuccess(true);
            })
            .catch(err => console.log(err))

        eventFormReset();
    }

    const onSubmitEventEditHandler = (e) => {
        e.preventDefault();

        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const data = new FormData(e.target);
        const event = dataParser(data);
        event.image = imagePreview;
        event.location = point;

        const dateError = eventDataValidation('date', event.date,data.get('month'));
        setValidationError(prev => ({ ...prev, 'date': dateError }));

        
        if (event.name === '' || event.description === '') {
            setValidationError(prev => ({ ...prev, 'required': '*Topic, description, date and location are required.' }))
            return;
        }
        
        if (validationError.name || validationError.description
            || validationError.image || dateError) {
            return;
        }

        editEvent(eventValue.id, event)
            .then(res => {
                setIsloading(true);
               
                setEventValue(prev => ({ ...prev, res }));
                setIsSuccess(true);
            })
            .catch(err => console.log(err))

        eventFormReset();
    }

    const onBlurInputHandler = (e) => {
        const value = e.target.value;
        const type = e.target.name;

        if (validationError.required) {
            setValidationError(prev => ({ ...prev, "required": null }))
        }

        const error = eventDataValidation(type, value);
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

        const error = eventDataValidation(type, value);
        setValidationError(prev => ({ ...prev, [type]: error }))
        if (error) {
            return;
        }
    }

    const onChangeImageHandler = (e) => {
        const value = e.target.files[0];

        const error = eventDataValidation('imageUrl', (value || ''));
        setValidationError(prev => ({ ...prev, 'image': error }))
        if (error) {
            return;
        }
        if (!value) {
            setImagePreview(DEFAULT_EVENT_URL);
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

    const setInitialEventEditValue = useCallback((eventId) => {
        setIsloading(true);
        getEventById(eventId)
            .then(res => {
                setEventValue(res);
                setPoint(res.location)
                setImagePreview(res.imageUrl);
                setIsloading(false);
                if(res.creator!==user.username){
                    setNotCreator(true);
                }
            })
            .catch(err => console.log(err))
    }, [])

    const onClickCancelEventHandler = async (e) => {
		e.preventDefault();
		await cancelEvent(eventValue.id);
        setEventValue(prev => ({ ...prev, status:'cancelled' }));
        setIsSuccess(true);
	}

    const eventFormReset = () => {
        setValidationError(INITIAL_EVENT_VALIDATION_ERROR);
        setIsloading(false);
        setIsSuccess(false);
        setPoint(DEFAULT_LAG_LTD);
        setEventValue(INITIAL_EVENT_VALUE);
        setImagePreview(DEFAULT_EVENT_URL);
    }

    return {
        eventValue,
        notCreator,
        isLoading,
        isImageLoading,
        isSuccess,
        validationError,
        imagePreview,
        getGeoPoint,
        onChangeImageHandler,
        onBlurInputHandler,
        onChangeInputHandler,
        onSubmitEventCreateHandler,
        setInitialEventEditValue,
        onSubmitEventEditHandler,
        onClickCancelEventHandler,
        eventFormReset
    }
}

export default useEventForm;

const dataParser = (data) => {
    const year = data.get('year');
    const month = Number(data.get('month')) - 1;
    const day = data.get('day');
    const hour = data.get('hour');
    const minute = data.get('minute');
    const date = new Date(year, month, day, hour, minute, 0);
    const event = {
        name: data.get('name'),
        location: data.get('location'),
        description: data.get('description'),
        date: date,
        status: data.get('status') || 'active'
    }
    return event;
}