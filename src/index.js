import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import ErrorBoundary from './ErrorBoundary';
import AuthContextProvider from './AuthContextProvider';
import NotificationContextProvider from './NotificationContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthContextProvider>
        <NotificationContextProvider>
        <BrowserRouter basename="/read-aloud">
          <App />
        </BrowserRouter>
        </NotificationContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
