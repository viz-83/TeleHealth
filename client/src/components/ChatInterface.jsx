import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import axios from 'axios';

const ChatInterface = () => {
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return;

        const initChat = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/api/stream/token', { userId: user._id });

                const client = StreamChat.getInstance(data.apiKey);

                await client.connectUser(
                    {
                        id: user._id,
                        name: user.name,
                    },
                    data.token
                );

                console.log('Token received:', data.token);
                const channel = client.channel('messaging', 'general-v2', {
                    name: 'General Room V2',
                });

                await channel.watch();

                setChatClient(client);
                setChannel(channel);
            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        initChat();

        return () => {
            if (chatClient) chatClient.disconnectUser();
        };
    }, [user?._id]);

    if (!chatClient || !channel) return <div>Loading Chat...</div>;

    return (
        <div className="h-screen">
            <Chat client={chatClient} theme="messaging light">
                <Channel channel={channel}>
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
};

export default ChatInterface;
