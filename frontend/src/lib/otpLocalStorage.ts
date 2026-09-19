import { useCallback, useEffect, useState, useRef } from "react";

export const useOtpLocalStorage = (key = "otp_coolDown_time", initialSeconds = 0) => {
    // lazy initialization of remaining time based on current time vs stored target expiry
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const savedExpiry = localStorage.getItem(key);
        if (savedExpiry) {
            const remaining = Math.ceil((Number(savedExpiry) - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return Math.max(0, initialSeconds);
    });

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // function to set/start target timer
    const startTimer = useCallback((seconds: number) => {
        const targetExpiry = Date.now() + seconds * 1000;
        localStorage.setItem(key, targetExpiry.toString());
        setTimeLeft(seconds);
    }, [key]);

    // function to clear/stop timer
    const stopTimer = () => {
        localStorage.removeItem(key);
        setTimeLeft(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, String(Date.now() + timeLeft * 1000));
            }
            intervalRef.current = setInterval(() => {
                const savedExpiry = localStorage.getItem(key);
                if (savedExpiry) {
                    const remaining = Math.ceil((Number(savedExpiry) - Date.now()) / 1000);
                    if (remaining <= 0) {
                        setTimeLeft(0);
                        localStorage.removeItem(key);
                        if (intervalRef.current) clearInterval(intervalRef.current);
                    } else {
                        setTimeLeft(remaining);
                    }
                } else {
                    setTimeLeft(0);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timeLeft, key]);

    return [timeLeft, startTimer, stopTimer] as const;
};
