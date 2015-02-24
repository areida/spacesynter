'use strict';

var React = require('react');

module.exports = React.createClass({

    displayName : '404',

    render()
    {
        var style1,
            style2;

        style1 = {
            'textAlign'  : 'center',
            'marginTop'  : '200px',
            'fontSize'   : '180px',
            'fontWeight' : 'bold'
        };

        style2 = {
            'textAlign' : 'center',
            'fontSize'  : '20px'
        };

        return (
            <div>
                <h1 style={style1}>{'404'}</h1>
                <h2 style={style2}>{'Sorry, that page was not found.'}</h2>
            </div>
        );

    }

});
