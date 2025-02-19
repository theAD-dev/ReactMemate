import { createContext, useContext, useState, useEffect, useRef } from "react";
const TrialHeightContext = createContext();

export const TrialHeightProvider = ({ children }) => {
    const [trialHeight, setTrialHeight] = useState(0);

    return (
        <TrialHeightContext.Provider value={{ trialHeight, setTrialHeight }}>
            {children}
        </TrialHeightContext.Provider>
    )
}

export const useTrialHeight = () => useContext(TrialHeightContext);