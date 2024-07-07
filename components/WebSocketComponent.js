import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import useWebSocket from '@/useWebSocket'; // Adjust the path as needed

const WebSocketComponent = ({ userId }) => {
  const handleWebSocketMessage = (message) => {
    if (message.type === 'new_event') {
      Alert.alert(
        'New Event Notification',
        `Event: ${message.event.name}\nDescription: ${message.event.description}`
      );
    }
  };

  useWebSocket(userId, handleWebSocketMessage);

  return null; // No need to render anything
};

export default WebSocketComponent;
