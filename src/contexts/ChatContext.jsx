import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectStomp, disconnectStomp, subscribeToTopic, unsubscribeFromTopic } from '../api/stompClient';
import { getMyChatRooms } from '../api'; // getMyChatRooms 임포트
import { useAuth } from './AuthContext'; // useAuth를 임포트

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 인증 상태 가져오기
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatView, setChatView] = useState('list'); // 'list' or 'room'
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [stompConnected, setStompConnected] = useState(false);

  // 초기 총 안 읽은 메시지 수를 가져오는 함수
  const fetchInitialUnreadCount = async () => {
    try {
      const response = await getMyChatRooms();
      const total = response.data.data.reduce((sum, room) => sum + room.unreadCount, 0);
      setTotalUnreadCount(total);
    } catch (error) {
      console.error("Failed to fetch initial unread count:", error);
      setTotalUnreadCount(0); // 에러 발생 시 0으로 초기화
    }
  };

  // STOMP 연결 및 총 안 읽은 메시지 수 구독 관리
  useEffect(() => {
    if (isAuthenticated) {
      // 인증 시 초기 안 읽은 메시지 수 가져오기
      fetchInitialUnreadCount();

      const onStompConnect = () => {
        setStompConnected(true);
        console.log('STOMP connected in ChatProvider');

        // 총 안 읽은 메시지 수 토픽 구독
        const unreadTopic = `/user/queue/totalUnreadCount`; // 백엔드 토픽 경로 가정
        subscribeToTopic(unreadTopic, (message) => {
          console.log('Received total unread count:', message);
          // 백엔드 메시지 형식에 따라 파싱 (예: { count: 5 } )
          const newTotalUnreadCount = message.count || 0;
          setTotalUnreadCount(newTotalUnreadCount);
        });
      };

      const onStompError = (error) => {
        setStompConnected(false);
        console.error('STOMP error in ChatProvider:', error);
      };

      connectStomp(onStompConnect, onStompError);

      return () => {
        console.log('Cleaning up STOMP connection in ChatProvider');
        unsubscribeFromTopic(`/user/queue/totalUnreadCount`);
        // Note: disconnectStomp() is usually called once per application lifecycle,
        // often on logout or when the main STOMP client is no longer needed.
        // For individual subscriptions, unsubscribeFromTopic is sufficient.
      };
    } else {
      // 비인증 상태일 때 연결 해제 및 상태 초기화
      if (stompConnected) {
        disconnectStomp();
        setStompConnected(false);
      }
      setTotalUnreadCount(0);
    }
  }, [isAuthenticated]); // isAuthenticated 변경 시에만 실행

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const showRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setChatView('room');
  };

  const showList = () => {
    setSelectedRoomId(null);
    setChatView('list');
  };

  const value = {
    isChatOpen,
    toggleChat,
    openChat,
    closeChat,
    chatView,
    selectedRoomId,
    showRoom,
    showList,
    totalUnreadCount,
    setTotalUnreadCount,
    stompConnected, // STOMP 연결 상태도 제공
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
