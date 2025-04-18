import { useState, useEffect, useRef } from "react";

function useTimer(timer, ftn) {
    const [countdown, setCountdown] = useState(timer);
    const timerRef = useRef(null);
    const timerLogic = () => {
        setCountdown((prev) => {
          ftn(prev);
          if(prev <= 1) {
              clearInterval(timerRef.current);
          }
          return prev - 1;
        });
    };
    useEffect(() => {
        timerRef.current = setInterval(timerLogic, 1000);
        return () => clearInterval(timerRef.current);
      }, []);    
      const resetTimer = () => {
        console.log('anukriti');
        clearInterval(timer);
        setCountdown(timer);
        timerRef.current = setInterval(timerLogic, 1000)
      }
      const stopTimer = () => { clearInterval(timerRef.current);}
      return {countdown, resetTimer, stopTimer};
}



export default useTimer;