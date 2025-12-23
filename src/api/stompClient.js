import { Client } from "@stomp/stompjs";
import { API_URL } from "./index";

let stompClient = null;
let subscriptions = {};

export const connectStomp = (onConnect, onError) => {
  if (stompClient && stompClient.connected) {
    onConnect();
    return;
  }

  const wsUrl = API_URL.replace(/^http/, "ws") + "/ws-chat";

  stompClient = new Client({
    brokerURL: wsUrl,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    debug: function (str) {
      //console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log("STOMP Connected");
      onConnect();
    },
    onStompError: frame => {
      console.error("STOMP Error:", frame);
      if (onError) onError(frame);
    },
    onWebSocketClose: () => {
      console.log("WebSocket Closed");
    },
    onDisconnect: () => {
      console.log("STOMP Disconnected");
      subscriptions = {}; // Disconnect 시 모든 구독 초기화
    },
  });

  stompClient.activate();
};

export const disconnectStomp = () => {
  if (stompClient) {
    Object.values(subscriptions).forEach(sub => sub.unsubscribe());
    subscriptions = {};
    stompClient.deactivate();
    stompClient = null;
    console.log("STOMP Disconnected.");
  }
};

export const subscribeToRoom = (roomId, onMessageReceived) => {
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client not connected.");
    return;
  }
  const destination = `/topic/room.${roomId}`;
  if (subscriptions[destination]) {
    console.log(`Already subscribed to ${destination}`);
    return subscriptions[destination];
  }
  const subscription = stompClient.subscribe(destination, message => {
    onMessageReceived(JSON.parse(message.body));
  });
  subscriptions[destination] = subscription;
  console.log(`Subscribed to ${destination}`);
  return subscription;
};

// 새로운 함수: 특정 토픽을 구독하는 범용 함수
export const subscribeToTopic = (topic, onMessageReceived) => {
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client not connected for topic subscription.");
    return;
  }
  if (subscriptions[topic]) {
    console.log(`Already subscribed to topic ${topic}`);
    return subscriptions[topic];
  }
  const subscription = stompClient.subscribe(topic, message => {
    onMessageReceived(JSON.parse(message.body));
  });
  subscriptions[topic] = subscription;
  console.log(`Subscribed to topic ${topic}`);
  return subscription;
};

export const unsubscribeFromRoom = roomId => {
  const destination = `/topic/room.${roomId}`;
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
    delete subscriptions[destination];
    console.log(`Unsubscribed from ${destination}`);
  }
};

// 새로운 함수: 특정 토픽을 구독 해제하는 범용 함수
export const unsubscribeFromTopic = topic => {
  if (subscriptions[topic]) {
    subscriptions[topic].unsubscribe();
    delete subscriptions[topic];
    console.log(`Unsubscribed from topic ${topic}`);
  }
};

export const sendChatMessage = (roomId, message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat/send",
      body: JSON.stringify({ roomId, message }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } else {
    console.error("STOMP client not connected, cannot send message.");
  }
};
