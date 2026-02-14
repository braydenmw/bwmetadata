import { useEffect } from 'react';

const useEscapeKey = (callback: () => void) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                callback();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [callback]);
};

export default useEscapeKey;

