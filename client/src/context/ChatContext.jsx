import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatClient, setChatClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const initChat = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/api/v1/stream/user-token', {}, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const client = StreamChat.getInstance(data.apiKey);

                await client.connectUser(
                    {
                        id: user._id,
                        name: user.name,
                    },
                    data.token
                );

                setChatClient(client);
                setLoading(false);
            } catch (error) {
                console.error('Error initializing chat:', error);
                setLoading(false);
            }
        };

        if (!chatClient) {
            initChat();
        }

        return () => {
            if (chatClient) {
                chatClient.disconnectUser();
                setChatClient(null);
            }
        };
    }, [user?._id]);

    if (loading) return <div>Loading Chat Services...</div>;

    return (
        <ChatContext.Provider value={{ chatClient }}>
            {children}
        </ChatContext.Provider>
    );
};
