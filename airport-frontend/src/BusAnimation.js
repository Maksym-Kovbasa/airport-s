import React, { useEffect, useRef } from 'react';
import './BusAnimation.css';

const BusAnimation = ({ onAnimationEnd }) => {
    const busRef = useRef(null);

    useEffect(() => {
        const bus = busRef.current;
        if (bus) {
            const handleAnimationEnd = () => {
                if (onAnimationEnd) {
                    onAnimationEnd();
                }
            };
            bus.addEventListener("animationend", handleAnimationEnd);

            return () => {
                bus.removeEventListener("animationend", handleAnimationEnd);
            };
        }
    }, [onAnimationEnd]);

    return (
        <div className="bus-container">
            <div className="bus" ref={busRef}>🚌</div>
        </div>
    );
};

export default BusAnimation;
