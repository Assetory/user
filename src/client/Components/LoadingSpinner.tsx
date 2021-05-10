import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner : React.FunctionComponent = () : React.ReactElement =>
{
    return (
        <div className="LoadingSpinner">
            <div className="spinner">
                Loading...
            </div>
        </div>
    );
};

export default LoadingSpinner;
