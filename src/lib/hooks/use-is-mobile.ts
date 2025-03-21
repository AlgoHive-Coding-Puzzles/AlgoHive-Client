'use client';
import { useState, useLayoutEffect } from 'react';

function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        setIsMobile(window.innerWidth < breakpoint);
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
}

export default useIsMobile;
