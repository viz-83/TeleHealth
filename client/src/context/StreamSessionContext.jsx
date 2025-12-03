import React, { createContext, useState, useContext } from 'react';

const StreamSessionContext = createContext();

export const useStreamSession = () => useContext(StreamSessionContext);

export const StreamSessionProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(null);

    const setSession = (data) => {
        setSessionData(data);
    };

    const clearSession = () => {
        setSessionData(null);
    };

    return (
        <StreamSessionContext.Provider value={{ sessionData, setSession, clearSession }}>
            {children}
        </StreamSessionContext.Provider>
    );
};
