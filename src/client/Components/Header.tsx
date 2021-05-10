import React from 'react';

const Header : React.FunctionComponent = () : React.ReactElement =>
{
    return (
        <div>
            <ul>
                <li><a href={'/'}>Back</a></li>
                <li><a href={`/${ process.env.SERVICE_NAME }/api/test`}>Api test</a></li>
                <li><a href={`/${ process.env.SERVICE_NAME }/`}>Dashboard home</a></li>
                <li><a href={`/${ process.env.SERVICE_NAME }/public`}>Public page</a></li>
                <li><a href={`/${ process.env.SERVICE_NAME }/error`}>Error page</a></li>
            </ul>

            <hr />
        </div>
    );
};

export default Header;
