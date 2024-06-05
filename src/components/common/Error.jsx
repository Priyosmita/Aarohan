
import React from 'react'

function ErrorBox({ errorMessages , onClose, style="bg-red-100 border-red-400 text-red-700"}) {
    const style_1 = "border px-4 py-3 rounded relative "+`${style}`
    return (
        
        <div className={style_1} role="alert">
            <span className="block sm:inline">{errorMessages}</span>
            <strong className="font-bold"> !</strong>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </span>
        </div>
    );
}


export default ErrorBox
