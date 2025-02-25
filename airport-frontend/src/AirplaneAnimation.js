import React, { useEffect, useRef } from 'react';
import "./AirplaneAnimation.css";

const AirplaneAnimation = ({ onAnimationEnd }) => {
    const airplaneRef = useRef(null);

    useEffect(() => {
        const airplane = airplaneRef.current;
        if (airplane) {
            const handleAnimationEnd = () => {
                if (onAnimationEnd) {
                    onAnimationEnd(); 
                }
            };
            airplane.addEventListener("animationend", handleAnimationEnd);

            return () => {
                airplane.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [onAnimationEnd]);

    return (
        <div className="airplane-container">
            <div className="airplane" ref={airplaneRef}>✈️</div>
        </div>
    );
};

export default AirplaneAnimation;
