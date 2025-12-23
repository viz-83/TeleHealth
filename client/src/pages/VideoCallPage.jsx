import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    StreamVideoClient,
    StreamVideo,
    StreamCall,
    SpeakerLayout,
    useCallStateHooks,
    useCall,
    ParticipantView
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useStreamSession } from '../context/StreamSessionContext';
import axios from '../utils/axiosInstance';

const apiKey = 'p6yehc4e2xgg'; // Replace with actual key or env var

const CustomVideoLayout = () => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();


    // Deduplicate participants: filter out ghost sessions for the same user
    const uniqueParticipants = Object.values(
        participants.reduce((acc, participant) => {
            const existing = acc[participant.userId];



            // Logic to keep the "best" participant session
            if (!existing) {
                acc[participant.userId] = participant;
            } else {
                // If duplicate found:
                // 1. Always prefer the active local participant
                if (participant.isLocalParticipant) {
                    acc[participant.userId] = participant;
                } else if (!existing.isLocalParticipant) {
                    // 2. For remote users: Prefer the one who joined most recently
                    const existingTime = existing.joinedAt ? new Date(existing.joinedAt).getTime() : 0;
                    const newTime = participant.joinedAt ? new Date(participant.joinedAt).getTime() : 0;

                    if (newTime > existingTime) {
                        acc[participant.userId] = participant;
                    }
                }
            }
            return acc;
        }, {})
    );

    return (
        <div className="flex flex-wrap justify-center items-center h-full w-full p-4 gap-4 overflow-y-auto">
            {uniqueParticipants.map((participant) => (
                <div
                    key={participant.sessionId}
                    className="w-full md:w-1/2 lg:w-1/3 aspect-video relative bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                    <ParticipantView
                        participant={participant}
                        // CRITICAL FIX: Explicitly mute local participant audio to prevent echo
                        muted={participant.isLocalParticipant}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm flex flex-col items-start">
                        <span className="font-bold">{participant.name || participant.userId} {participant.isLocalParticipant ? '(You)' : ''}</span>
                        {/* ID and Session hidden as per user request */}
                    </div>
                </div>
            ))}
        </div>
    );
};

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
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isMicMuted ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70' : 'bg-primary hover:bg-green-700'}`}
                title={isMicMuted ? "Unmute" : "Mute"}
            >
                {isMicMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 dark:text-red-400">
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
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isCamMuted ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70' : 'bg-primary hover:bg-green-700'}`}
                title={isCamMuted ? "Turn Video On" : "Turn Video Off"}
            >
                {isCamMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 dark:text-red-400">
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
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${!isScreenShareOff ? 'bg-cta hover:bg-teal-700' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                title="Share Screen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${!isScreenShareOff ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
            </button>

            {/* Reactions Menu Container */}
            <div className="relative">
                {/* Reaction Menu */}
                {showReactions && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-3 flex gap-3 animate-fade-in-up border border-gray-200 dark:border-gray-700 z-50 min-w-max">
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
                                className="text-2xl hover:scale-125 transition-transform duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                {reaction.icon}
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Reaction Toggle Button */}
                <button
                    onClick={() => setShowReactions(!showReactions)}
                    className={`p-4 rounded-full transition-all duration-200 shadow-lg ${showReactions ? 'bg-cta hover:bg-teal-700' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    title="Reactions"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${showReactions ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
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
    const [permissionDenied, setPermissionDenied] = useState(false);

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
                    navigate('/');
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
            const newClient = StreamVideoClient.getOrCreateInstance({
                apiKey,
                user,
                token: currentSession.videoToken,
            });
            clientRef.current = newClient;

            const newCall = newClient.call('default', currentSession.callId);

            try {
                // Diagnostic: List available devices
                const devices = await navigator.mediaDevices.enumerateDevices();
                console.log('Available Devices:', devices.map(d => `${d.kind}: ${d.label}`));

                // Explicitly requesting simple constraints to avoid high-res failures
                await newCall.join({
                    create: true,
                    video: true,
                    audio: true
                });
            } catch (error) {
                console.error('Error joining call:', error);
                const errorMessage = error?.message || error?.name || '';
                if (
                    errorMessage.includes('NotAllowedError') ||
                    errorMessage.includes('Permission denied') ||
                    errorMessage.includes('NotReadableError') ||
                    errorMessage.includes('Could not start video source')
                ) {
                    if (mounted) setPermissionDenied(errorMessage); // Store the actual error message
                    return; // Exit, logic below waits for permission fix
                }
                alert(`Failed to join call: ${errorMessage}`);
                navigate('/');
                return;
            }

            if (mounted) {
                setClient(newClient);
                setCall(newCall);
            }
        };

        initCall();

        return () => {
            mounted = false;
            // Safely cleanup call if it exists
            if (call) {
                const stopTracks = async () => {
                    try {
                        console.log('Stopping tracks (cleanup)...');

                        // Aggressive Track Stopping
                        if (call.camera) {
                            await call.camera.disable();
                            call.camera.state?.mediaStream?.getTracks().forEach(t => t.stop());
                        }
                        if (call.microphone) {
                            await call.microphone.disable();
                            call.microphone.state?.mediaStream?.getTracks().forEach(t => t.stop());
                        }

                        await call.leave();
                        if (clientRef.current) {
                            await clientRef.current.disconnectUser();
                        }
                    } catch (err) {
                        console.warn('Error during call cleanup:', err);
                    }
                };
                stopTracks();
            }

            // NOTE: We do NOT disconnectUser() here. 
            // In React Strict Mode, unmount/remount happens instantly.
            // Disconnecting the user kills the singleton session, causing "User not found" on remount.
            // Stream SDK handles connection reuse via getOrCreateInstance.
            if (clientRef.current) {
                setClient(null);
                setCall(null);
                clientRef.current = null;
            }
        };
    }, [appointmentId, sessionData, setSession, navigate]);

    const handleEndCall = async () => {
        if (call) {
            try {
                console.log('Ending call: Disabling media tracks...');

                // 1. Stop Camera Tracks
                if (call.camera) {
                    await call.camera.disable();
                    if (call.camera.state?.mediaStream) {
                        call.camera.state.mediaStream.getTracks().forEach(track => {
                            console.log('Stopping camera track:', track.label);
                            track.stop();
                        });
                    }
                }

                // 2. Stop Microphone Tracks
                if (call.microphone) {
                    await call.microphone.disable();
                    if (call.microphone.state?.mediaStream) {
                        call.microphone.state.mediaStream.getTracks().forEach(track => {
                            console.log('Stopping mic track:', track.label);
                            track.stop();
                        });
                    }
                }

                // 3. Leave and Disconnect
                await call.leave();
                if (client) {
                    await client.disconnectUser();
                }
            } catch (err) {
                console.error('Error disabling media tracks:', err);
            }
        }
        // Force fully reload/navigate to ensure browser releases hardware
        // navigate('/'); 
        window.location.href = '/';
    };

    if (permissionDenied) {
        return (
            <div className="h-screen w-screen bg-gray-900 flex flex-col justify-center items-center text-white p-6 text-center">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl border border-red-500 overflow-y-auto max-h-[90vh]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mx-auto mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-4">Permissions Issue Detect</h2>
                    <p className="mb-4 text-gray-300">
                        We could not access your camera or microphone. This is usually due to <strong>System Privacy Settings</strong> or <strong>Another App</strong> using the device.
                    </p>

                    <div className="bg-gray-700 p-4 rounded-lg text-left mb-6 text-sm">
                        <h3 className="font-bold text-lg mb-2 text-cta">🔧 Troubleshooting Guide</h3>
                        <p className="mb-2 text-yellow-300 font-semibold">
                            Based on the error, we detected:
                            {permissionDenied.includes('NotReadableError') ? (
                                <span className="text-white bg-red-600 px-2 py-1 rounded ml-2">Camera in Use / Hardware Error</span>
                            ) : permissionDenied.includes('Permission denied by system') ? (
                                <span className="text-white bg-red-600 px-2 py-1 rounded ml-2">OS System Block</span>
                            ) : (
                                <span className="text-white bg-red-600 px-2 py-1 rounded ml-2">Permission Denied</span>
                            )}
                        </p>

                        <ol className="list-decimal pl-5 space-y-2 mt-4">
                            {permissionDenied.includes('NotReadableError') && (
                                <>
                                    <li><strong>Another App is Using Camera:</strong> Check if Zoom, Teams, Discord, or another browser tab is open and using the camera. <strong>Close them completely.</strong></li>
                                    <li><strong>Hardware Glitch:</strong> Unplug and re-plug your webcam (if external), or restart your laptop.</li>
                                </>
                            )}

                            {(permissionDenied.includes('Permission denied by system') || permissionDenied.includes('NotAllowedError')) && (
                                <>
                                    <li>
                                        <strong>Check Windows Settings:</strong> Go to <em>Start &gt; Settings &gt; Privacy &amp; security &gt; Camera</em>.
                                        <br />Ensure <strong>"Let desktop apps access your camera"</strong> is ON.
                                    </li>
                                    <li>
                                        <strong>Check Mac Settings:</strong> System Preferences &gt; Security & Privacy &gt; Camera. Ensure your browser is checked.
                                    </li>
                                </>
                            )}

                            <li>
                                <strong>Browser Lock:</strong> Click the <strong>Lock icon 🔒</strong> in your address bar &gt; Reset Permissions.
                            </li>
                        </ol>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg text-left mb-6 text-sm">
                        <h3 className="font-bold text-lg mb-2 text-primary">🧪 Diagnostic Test</h3>
                        <p className="mb-2">Click below to test if your browser can access the camera directly (ignoring the app).</p>
                        <button
                            onClick={async () => {
                                try {
                                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                                    alert("✅ SUCCESS: Browser can access camera/mic! The issue is likely with the app connection. Please refresh.");
                                    stream.getTracks().forEach(t => t.stop());
                                } catch (err) {
                                    alert(`❌ FAILURE: Browser CANNOT access device. \nError: ${err.name} - ${err.message}\n\nPlease check Windows Privacy Settings or Driver drivers.`);
                                }
                            }}
                            className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold w-full transition-colors"
                        >
                            Run Native Camera Test
                        </button>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-cta hover:bg-teal-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-accent hover:bg-gray-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!client || !call) return <div className="text-center mt-20 text-white">Joining call...</div>;

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <div className="flex-1 relative overflow-hidden">
                        <CustomVideoLayout />
                        {/* Waiting Room Overlay */}
                        {sessionData?.appointmentStatus === 'IN_WAITING_ROOM' && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full shadow-lg z-10">
                                Waiting for the doctor to join...
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-gray-800/90 backdrop-blur-md flex justify-center items-center gap-4 shrink-0 border-t border-gray-700">
                        <CustomCallControls onLeave={handleEndCall} />
                    </div>
                </StreamCall>
            </StreamVideo>
        </div>
    );
};

export default VideoCallPage;
