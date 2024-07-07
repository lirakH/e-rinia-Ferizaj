import { useEffect, useRef } from 'react';
import { MEDIA_BASE_URL } from '@/config'; // Adjust the path as needed

const useWebSocket = (onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    const wsUrl = `${MEDIA_BASE_URL.replace('http', 'ws')}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (onMessage) {
        onMessage(message);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onMessage]);

  return ws.current;
};

export default useWebSocket;
