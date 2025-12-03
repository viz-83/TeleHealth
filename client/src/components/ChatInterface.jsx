import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useChat } from '../context/ChatContext';

const ChatInterface = () => {
    const { chatClient } = useChat();
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        if (!chatClient) return;

        const initChannel = async () => {
            const channel = chatClient.channel('messaging', 'general-v2', {
                name: 'General Room V2',
            });

            await channel.watch();
            setChannel(channel);
        };

        initChannel();
    }, [chatClient]);

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
