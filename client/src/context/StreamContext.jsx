import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import axios from 'axios';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return;

        const initClient = async () => {
            try {
                const { data } = await axios.post('http://localhost:5000/api/stream/token', { userId: user._id });

                const streamUser = {
                    id: user._id,
                    name: user.name,
                };

                const newClient = new StreamVideoClient({
                    apiKey: data.apiKey,
                    user: streamUser,
                    token: data.token,
                });

                setClient(newClient);
            } catch (error) {
                console.error('Error initializing Stream client:', error);
            }
        };

        initClient();

        return () => {
            if (client) client.disconnectUser();
        };
    }, [user?._id]);

    if (!client) return <>{children}</>;

    return (
        <StreamVideo client={client}>
            <StreamContext.Provider value={{ client }}>
                {children}
            </StreamContext.Provider>
        </StreamVideo>
    );
};
