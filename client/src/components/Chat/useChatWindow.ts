import { useEffect, useRef } from "react";

export function useChatScroll(message: any) {
  const refe = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (refe.current) {
      refe.current.scrollTop = refe.current.scrollHeight;
    }
  }, [message]);
  return refe;
}

