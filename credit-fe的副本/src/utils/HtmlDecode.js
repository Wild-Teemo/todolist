import React from 'react';
export default function htmldecode(rawHTML) {
    return React.createElement('div', {
        dangerouslySetInnerHTML: { __html: rawHTML }
    });
}
