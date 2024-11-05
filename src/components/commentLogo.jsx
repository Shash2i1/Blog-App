import React from 'react';
import logo from '../assets/comment-dots-regular.svg';

function CommentLogo({ width = '20px', altText = 'Company Logo' }) {
    return (
        <div>
            <img src={logo} alt={altText} style={{ width }} />
        </div>
    );
}

export default CommentLogo;
