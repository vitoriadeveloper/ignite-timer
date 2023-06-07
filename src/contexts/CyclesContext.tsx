import { ReactNode, createContext, useReducer, useState } from "react";
import { cyclesReducer } from "../reducers/cycles";

export interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}
interface CreateCycleData {
    task: string;
    minutesAmount: number;
}
interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}
interface CyclesContextProviderProps {
    children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null,
    });

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const { activeCycleId, cycles } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };
        dispatch({
            type: "ADD_NEW_CYCLE",
            payload: {
                newCycle,
            },
        });

        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch({
            type: "INTERRUPT_CURRENT_CYCLE",
            payload: {
                activeCycleId,
            },
        });
    }

    function markCurrentCycleAsFinished() {
        dispatch({
            type: "MARK_CURRENT_CYCLE_AS_FINISHED",
            payload: {
                activeCycleId,
            },
        });
    }
    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }
    return (
        <CyclesContext.Provider
            value={{
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
                cycles,
            }}
        >
            {children}
        </CyclesContext.Provider>
    );
}
