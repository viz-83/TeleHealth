import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    StreamVideoClient,
    StreamVideo,
    StreamCall,
    SpeakerLayout,
    useCallStateHooks,
    useCall
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useStreamSession } from '../context/StreamSessionContext';
import axios from 'axios';

const apiKey = 'p6yehc4e2xgg'; // Replace with actual key or env var

const CustomCallControls = ({ onLeave }) => {
    const call = useCall();
    const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();
    const { microphone, isMute: isMicMuted } = useMicrophoneState();
    const { camera, isMute: isCamMuted } = useCameraState();
    const { screenShare, isMute: isScreenShareOff } = useScreenShareState();
    const [showReactions, setShowReactions] = useState(false);

    return (
        <div className="flex items-center justify-center gap-6 px-4 py-2">
            {/* Microphone */}
            <button
                onClick={() => microphone.toggle()}
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                title={isMicMuted ? "Unmute" : "Mute"}
            >
                {isMicMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                )}
            </button>

            {/* Camera */}
            <button
                onClick={() => camera.toggle()}
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isCamMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                title={isCamMuted ? "Turn Video On" : "Turn Video Off"}
            >
                {isCamMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9a2.25 2.25 0 0 1 2.25-2.25h7.5a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h7.5a2.25 2.25 0 0 0 2.25-2.25V9a2.25 2.25 0 0 0-2.25-2.25h-7.5A2.25 2.25 0 0 0 2.25 9v7.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                )}
            </button>

            {/* Screen Share */}
            <button
                onClick={() => screenShare.toggle()}
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${!isScreenShareOff ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                title="Share Screen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
            </button>

            {/* Reactions Menu Container */}
            <div className="relative">
                {/* Reaction Menu */}
                {showReactions && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-2xl shadow-xl p-3 flex gap-3 animate-fade-in-up border border-gray-700 z-50 min-w-max">
                        {[
                            { icon: '👍', type: 'reaction', emoji: ':thumbsup:' },
                            { icon: '👎', type: 'reaction', emoji: ':thumbsdown:' },
                            { icon: '✋', type: 'raise-hand', emoji: ':raised_hand:' },
                            { icon: '❤️', type: 'reaction', emoji: ':heart:' },
                            { icon: '😂', type: 'reaction', emoji: ':joy:' },
                        ].map((reaction) => (
                            <button
                                key={reaction.icon}
                                onClick={async () => {
                                    try {
                                        await call?.sendReaction({
                                            type: reaction.type,
                                            emoji_code: reaction.emoji,
                                            custom: { emoji: reaction.icon }
                                        });
                                        setShowReactions(false);
                                    } catch (err) {
                                        console.error('Failed to send reaction:', err);
                                    }
                                }}
                                className="text-2xl hover:scale-125 transition-transform duration-200 p-2 hover:bg-gray-700 rounded-lg"
                            >
                                {reaction.icon}
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Reaction Toggle Button */}
                <button
                    onClick={() => setShowReactions(!showReactions)}
                    className={`p-4 rounded-full transition-all duration-200 shadow-lg ${showReactions ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    title="Reactions"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                </button>
            </div>

            {/* End Call */}
            <button
                onClick={onLeave}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg"
                title="End Call"
            >
                {/* Phone Down Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
            </button>
        </div>
    );
};

const VideoCallPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { sessionData, setSession } = useStreamSession();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const initCall = async () => {
            // Prevent multiple initializations
            if (clientRef.current) return;

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
                        if (mounted) setSession(currentSession);
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                    alert('Failed to join call. Please try again.');
                    navigate('/dashboard');
                    return;
                }
            }

            if (!currentSession || !mounted) return;

            if (!currentSession.callId) {
                console.error('Missing callId in session data');
                alert('Invalid call session. Please contact support.');
                return;
            }

            // Get user details from localStorage to display correct name
            const userData = JSON.parse(localStorage.getItem('user'));

            const user = {
                id: currentSession.userId,
                name: userData?.name || currentSession.userId, // Use name from localStorage or fallback to ID
                image: `https://getstream.io/random_png/?id=${currentSession.userId}&name=${userData?.name || currentSession.userId}`,
            };

            console.log('Initializing StreamVideoClient...');
            const newClient = new StreamVideoClient({ apiKey, user, token: currentSession.videoToken });
            clientRef.current = newClient;

            const newCall = newClient.call('default', currentSession.callId);
            await newCall.join({ create: true });

            if (mounted) {
                setClient(newClient);
                setCall(newCall);
            }
        };

        initCall();

        return () => {
            mounted = false;
            if (clientRef.current) {
                console.log('Disconnecting StreamVideoClient...');
                clientRef.current.disconnectUser();
                clientRef.current = null;
                setClient(null);
                setCall(null);
            }
        };
    }, [appointmentId, sessionData, setSession, navigate]);

    const handleEndCall = async () => {
        if (call) {
            await call.leave();
        }
        navigate('/dashboard');
    };

    if (!client || !call) return <div className="text-center mt-20 text-white">Joining call...</div>;

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <div className="flex-1 relative overflow-hidden">
                        <SpeakerLayout />
                        {/* Waiting Room Overlay */}
                        {sessionData?.appointmentStatus === 'IN_WAITING_ROOM' && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full shadow-lg z-10">
                                Waiting for the doctor to join...
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-gray-800 flex justify-center items-center gap-4 shrink-0">
                        <CustomCallControls onLeave={handleEndCall} />
                    </div>
                </StreamCall>
            </StreamVideo>
        </div>
    );
};

export default VideoCallPage;
