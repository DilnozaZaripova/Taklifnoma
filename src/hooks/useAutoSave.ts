import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-saving form data with debounce
 * @param data - The data to save
 * @param onSave - Callback function to execute save
 * @param delay - Debounce delay in milliseconds (default: 2000)
 */
export function useAutoSave<T>(
    data: T,
    onSave: (data: T) => Promise<void>,
    delay: number = 2000
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip auto-save on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(() => {
            onSave(data).catch(error => {
                console.error('Auto-save failed:', error);
            });
        }, delay);

        // Cleanup on unmount or data change
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, onSave, delay]);
}
