import React, { useEffect, useRef } from 'react';
import { MEDIA_BASE_URL } from '@/config';

const WebSocketComponent = ({ onNewEvent }) => {
  const ws = useRef(null);

  useEffect(() => {
    // Convert http:// to ws:// or https:// to wss://
    const wsUrl = MEDIA_BASE_URL.replace(/^http/, 'ws') + '/ws';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_event') {
        onNewEvent(data.event);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onNewEvent]);

  return null;
};

export default WebSocketComponent;
