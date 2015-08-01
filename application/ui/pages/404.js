'use strict';

import React from 'react';

class FourOhFour extends React.Component {
    render()
    {
        let h1Style, h2Style;

        h1Style = {
            textAlign  : 'center',
            marginTop  : '200px',
            fontSize   : '180px',
            fontWeight : 'bold'
        };

        h2Style = {
            textAlign : 'center',
            fontSize  : '20px'
        };

        return (
            <div>
                <h1 style={h1Style}>404</h1>
                <h2 style={h2Style}>Sorry, that page was not found.</h2>
            </div>
        );
    }
}

FourOhFour.displayName = '404';

export default FourOhFour;