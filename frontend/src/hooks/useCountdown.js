import { useState, useEffect, useRef } from 'react';

/**
 * Server-synchronous countdown hook
 * Uses the offset between the server's authoritative clock and the client's local performance
 * to ensure device clock manipulation does not unlock rewards early.
 */
export const useCountdown = (nextClaimAtStr, serverTimeStr, onExpire) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    formatted: '00:00:00',
    isExpired: true,
    totalSeconds: 0
  });

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const expiredTriggeredRef = useRef(false);

  useEffect(() => {
    if (!nextClaimAtStr) {
      setTimeLeft({
        hours: '00',
        minutes: '00',
        seconds: '00',
        formatted: '00:00:00',
        isExpired: true,
        totalSeconds: 0
      });
      return;
    }

    const nextClaimTime = new Date(nextClaimAtStr).getTime();
    // Calculate difference between server time and client device clock
    const serverTimeMs = serverTimeStr ? new Date(serverTimeStr).getTime() : Date.now();
    const clientNowMs = Date.now();
    const serverClockOffset = serverTimeMs - clientNowMs;

    expiredTriggeredRef.current = false;

    const updateTimer = () => {
      // Calculate current authoritative server time
      const estimatedServerNow = Date.now() + serverClockOffset;
      const difference = nextClaimTime - estimatedServerNow;

      if (difference <= 0) {
        setTimeLeft({
          hours: '00',
          minutes: '00',
          seconds: '00',
          formatted: '00:00:00',
          isExpired: true,
          totalSeconds: 0
        });

        if (!expiredTriggeredRef.current) {
          expiredTriggeredRef.current = true;
          if (typeof onExpireRef.current === 'function') {
            onExpireRef.current();
          }
        }
      } else {
        const totalSecs = Math.floor(difference / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;

        const pad = (n) => String(n).padStart(2, '0');
        const formatted = `${pad(h)}:${pad(m)}:${pad(s)}`;

        setTimeLeft({
          hours: pad(h),
          minutes: pad(m),
          seconds: pad(s),
          formatted,
          isExpired: false,
          totalSeconds: totalSecs
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextClaimAtStr, serverTimeStr]);

  return timeLeft;
};

export default useCountdown;
