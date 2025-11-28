import React, { useState } from 'react';
import {
    useCall,
    useStreamVideoClient,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const VideoCall = () => {
    const [callId, setCallId] = useState('');
    const client = useStreamVideoClient();
    const [call, setCall] = useState(null);

    const createCall = async () => {
        const id = callId || Math.random().toString(36).substring(7);
        const newCall = client.call('default', id);
        await newCall.join({ create: true });
        setCall(newCall);
    };

    if (call) {
        return (
            <StreamTheme>
                <StreamCall call={call}>
                    <div className="h-screen w-screen flex flex-col">
                        <SpeakerLayout />
                        <CallControls />
                    </div>
                </StreamCall>
            </StreamTheme>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Start a Video Call</h2>
            <input
                type="text"
                placeholder="Enter Call ID (optional)"
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
                className="border p-2 rounded mr-4"
            />
            <button onClick={createCall} className="bg-blue-600 text-white px-4 py-2 rounded">
                Start Call
            </button>
        </div>
    );
};

export default VideoCall;
