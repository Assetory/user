import React from 'react';

const Header : React.FunctionComponent = () : React.ReactElement =>
{
    return (
        <div>
            <ul>
                <li><a href={'/'}>Back</a></li>
                <li><a href={`/${ process.env.SERVICE_NAME }/api/test`}>User Api test</a></li>
                <li><a href={`/dashboard/`}>Dashboard home</a></li>
                <li><a href={`/dashboard/${ process.env.SERVICE_NAME }/`}>USER home</a></li>
                <li><a href={`/dashboard/${ process.env.SERVICE_NAME }/profile`}>USER Profile </a></li>
                <li><a href={`/dashboard/${ process.env.SERVICE_NAME }/error`}>Error page</a></li>
            </ul>

            <hr />
        </div>
    );
};

export default Header;
