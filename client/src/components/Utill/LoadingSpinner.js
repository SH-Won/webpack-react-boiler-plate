import React,{useRef} from 'react'
import '../../styles/LoadingSpinner.css';

const LoadingSpinner = (props) => {
    
    console.log(props);
    return (
        <div style={{...props}}>
         <div className="loading-container">
            <div className="loading-item" ></div>
            <div className="loading-item" ></div>
            <div className="loading-item" ></div>
            <div className="loading-item" ></div>
         </div>
        </div>
    )
}

// LoadingSpinner.defaultProps ={

// }

export default LoadingSpinner
