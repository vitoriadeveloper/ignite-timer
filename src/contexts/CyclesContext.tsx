import {
    ReactNode,
    createContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { cyclesReducer } from "../reducers/cycles/reducer";
import {
    addNewCycleAction,
    interruptCycleAction,
    markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

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
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        (initialState) => {
            const storedStateAsJSON = localStorage.getItem(
                "@ignite-timer:cycles-state-1.0.0",
            );
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON);
            }

            return initialState;
        },
    );
    const { activeCycleId, cycles } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate),
            );
        }
        return 0;
    });

    useEffect(() => {
        const stasteJSON = JSON.stringify(cyclesState);

        localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stasteJSON);
    }, [cyclesState]);

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };
        dispatch(addNewCycleAction(newCycle));

        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch(interruptCycleAction());
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
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
