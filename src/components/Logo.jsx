import React from 'react';
import logo from '../assets/logo.png';

function Logo({ width = '100px', altText = 'Company Logo' }) {
    return (
        <div>
            <img src={logo} alt={altText} style={{ width }} />
        </div>
    );
}

export default Logo;
