import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StreamVideoClient, StreamVideo, Call, StreamCall, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useStreamSession } from '../context/StreamSessionContext';
import axios from 'axios';

const apiKey = 'p6yehc4e2xgg'; // Replace with actual key or env var

const VideoCallPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { sessionData, setSession } = useStreamSession();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initCall = async () => {
            let currentSession = sessionData;

            // If no session data (refresh), fetch it
            if (!currentSession || currentSession.callId !== `call_${appointmentId}`) {
                try {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.post('http://localhost:5000/api/v1/stream/token',
                        { appointmentId, purpose: 'video' },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true
                        }
                    );
                    if (data.status === 'success') {
                        currentSession = data.data;
                        setSession(currentSession);
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                    alert('Failed to join call. Please try again.');
                    navigate('/dashboard');
                    return;
                }
            }

            if (!currentSession) return;

            if (!currentSession.callId) {
                console.error('Missing callId in session data');
                alert('Invalid call session. Please contact support.');
                return;
            }

            const user = {
                id: currentSession.userId,
                name: currentSession.userId, // Ideally fetch user name
                image: `https://getstream.io/random_png/?id=${currentSession.userId}&name=${currentSession.userId}`,
            };

            const newClient = new StreamVideoClient({ apiKey, user, token: currentSession.videoToken });
            const newCall = newClient.call('default', currentSession.callId);

            await newCall.join({ create: true });

            setClient(newClient);
            setCall(newCall);
            setLoading(false);
        };

        initCall();

        return () => {
            if (client) {
                client.disconnectUser();
            }
        };
    }, [appointmentId, sessionData, setSession, navigate]);

    const handleEndCall = async () => {
        if (call) {
            await call.leave();
            // Optional: Mark as completed if doctor
            // await axios.patch(...)
        }
        navigate('/dashboard');
    };

    if (loading) return <div className="text-center mt-20">Joining call...</div>;

    return (
        <div className="h-screen w-screen bg-gray-900">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <div className="h-full flex flex-col">
                        <div className="flex-1 relative">
                            <SpeakerLayout />
                            {/* Waiting Room Overlay */}
                            {sessionData?.appointmentStatus === 'IN_WAITING_ROOM' && (
                                <div className="absolute top-0 left-0 w-full bg-yellow-100 text-yellow-800 p-2 text-center z-10">
                                    Waiting for the doctor to join...
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-800 flex justify-center gap-4">
                            <CallControls onLeave={handleEndCall} />
                        </div>
                    </div>
                </StreamCall>
            </StreamVideo>
        </div>
    );
};

export default VideoCallPage;
