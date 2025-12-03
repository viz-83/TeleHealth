import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    useCall,
    useStreamVideoClient,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

import UserList from './UserList';
import { RingingCall } from '@stream-io/video-react-sdk';

const VideoCall = () => {
    const [callId, setCallId] = useState('');
    const [generatedCallId, setGeneratedCallId] = useState('');
    const client = useStreamVideoClient();
    const [call, setCall] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!client) return <div>Loading Video Client...</div>;

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.callId) {
            const call = client.call('default', location.state.callId);
            call.join({ create: true }).then(() => setCall(call));
        }
    }, [client, location.state]);

    const createCall = async () => {
        const id = callId || Math.random().toString(36).substring(7);
        const newCall = client.call('default', id);
        await newCall.join({ create: true });
        setCall(newCall);
    };

    const generateCallId = () => {
        const id = Math.random().toString(36).substring(7);
        setGeneratedCallId(id);
        setCallId(id);
    };

    const startCallWithUser = async (targetUserId) => {
        const id = [user._id, targetUserId].sort().join('-');
        const newCall = client.call('default', id);

        await newCall.getOrCreate({
            ring: true,
            data: {
                members: [
                    { user_id: user._id },
                    { user_id: targetUserId }
                ]
            }
        });
        setCall(newCall);
    };

    if (call) {
        return (
            <StreamTheme>
                <StreamCall call={call}>
                    <div className="fixed inset-0 z-50 bg-black flex flex-col">
                        <div className="flex-1 w-full relative">
                            <SpeakerLayout />
                        </div>
                        <div className="p-4 flex justify-center bg-gray-900">
                            <CallControls onLeave={() => setCall(null)} />
                        </div>
                    </div>
                    <RingingCall />
                </StreamCall>
            </StreamTheme>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-8">Video Calls</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Direct Calling Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Call a User</h3>
                    <UserList onCallUser={startCallWithUser} />
                </div>

                {/* Manual Join/Create Section */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h3 className="text-xl font-semibold mb-4">Create or Join Meeting</h3>

                    {/* Create New Meeting */}
                    <div className="mb-8">
                        <button
                            onClick={generateCallId}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-4"
                        >
                            Create New Meeting ID
                        </button>
                        {generatedCallId && (
                            <div className="p-3 bg-gray-100 rounded border flex justify-between items-center">
                                <span className="font-mono">{generatedCallId}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedCallId)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                >
                                    Copy
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-6">
                        <h4 className="text-md font-medium mb-2">Join by ID</h4>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Enter Call ID"
                                value={callId}
                                onChange={(e) => setCallId(e.target.value)}
                                className="border p-2 rounded-l w-full"
                            />
                            <button onClick={createCall} className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
