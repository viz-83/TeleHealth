import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import axios from 'axios';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const initClient = async () => {
            try {
                // Use the correct endpoint for generic user token
                const { data } = await axios.post('http://localhost:5000/api/v1/stream/user-token', {}, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const streamUser = {
                    id: user._id,
                    name: user.name,
                };

                // Use getOrCreateInstance to avoid duplicate client warnings
                const newClient = StreamVideoClient.getOrCreateInstance({
                    apiKey: data.apiKey,
                    user: streamUser,
                    token: data.token,
                });

                setClient(newClient);
                setLoading(false);
            } catch (error) {
                console.error('Error initializing Stream client:', error);
                setLoading(false);
            }
        };

        if (!client) {
            initClient();
        }
    }, [user?._id]); // Only re-run if user ID changes

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Video Services...</div>;
    if (!client) return <>{children}</>;

    return (
        <StreamVideo client={client}>
            <StreamContext.Provider value={{ client }}>
                {children}
            </StreamContext.Provider>
        </StreamVideo>
    );
};
