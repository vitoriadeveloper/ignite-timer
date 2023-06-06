import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
    CountDownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput,
} from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCicleFormSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
});

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
}

type NewCicleFormData = zod.infer<typeof newCicleFormSchema>; // typeof é sempre que quiser usar uma var js no ts
export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const { register, handleSubmit, watch, reset } = useForm({
        resolver: zodResolver(newCicleFormSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            // sempre que usar variavel externa, tem que colocar como obs no useEffect
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate),
                );
            }, 1000);
        }
        // serve para resetar a contagem caso o active cycle sofra mudanças
        return () => {
            clearInterval(interval);
        };
    }, [activeCycle]);
    function handleCreateNewCycle(data: NewCicleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };
        setCycles((state) => [...state, newCycle]); // sempre que o valor de um estado depender do valor anterior, usar arrow function
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
        reset();
    }

    function handleInterruptCycle() {
        setCycles(
            cycles.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() };
                } else {
                    return cycle;
                }
            }),
        );
        setActiveCycleId(null);
    }
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSecond = activeCycle ? totalSeconds - amountSecondsPassed : 0;
    const minutesAmount = Math.floor(currentSecond / 60);
    const secondsAmount = currentSecond % 60;

    const minutes = String(minutesAmount).padStart(2, "0");
    const seconds = String(secondsAmount).padStart(2, "0");
    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`;
        }
    }, [minutes, seconds, activeCycle]);

    const task = watch("task");
    const isSubmitDisabled = !task;
    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        type="text"
                        id="task"
                        placeholder="Dê um nome para o seu projeto"
                        list="tasks-suggestions"
                        disabled={!!activeCycle} // transforma em boolean
                        {...register("task")}
                    />
                    <datalist id="tasks-suggestions">
                        <option value="" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register("minutesAmount", { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountDownContainer>

                {activeCycle ? (
                    <StopCountdownButton
                        type="button"
                        onClick={handleInterruptCycle}
                    >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}
