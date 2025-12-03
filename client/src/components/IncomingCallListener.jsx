import React, { useEffect, useState } from 'react';
import { useCalls } from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';
import { useStream } from '../context/StreamContext';

const IncomingCallContent = () => {
    const calls = useCalls();
    const navigate = useNavigate();
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        const ringingCall = calls.find((call) => call.state.callingState === 'ringing');
        setIncomingCall(ringingCall);
    }, [calls]);

    const handleAccept = async () => {
        if (incomingCall) {
            await incomingCall.join();
            navigate('/video', { state: { callId: incomingCall.id } });
            setIncomingCall(null);
        }
    };

    const handleReject = async () => {
        if (incomingCall) {
            await incomingCall.leave({ reject: true });
            setIncomingCall(null);
        }
    };

    if (!incomingCall) return null;

    return (
        <div className="fixed top-4 right-4 z-50 bg-white p-6 rounded-lg shadow-xl border border-blue-100 animate-bounce-in">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Incoming Call...</h3>
            <p className="text-sm text-gray-600 mb-4">Someone is calling you.</p>
            <div className="flex space-x-4">
                <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                >
                    Accept
                </button>
                <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

const IncomingCallListener = () => {
    const stream = useStream();
    if (!stream || !stream.client) return null;
    return <IncomingCallContent />;
};

export default IncomingCallListener;
