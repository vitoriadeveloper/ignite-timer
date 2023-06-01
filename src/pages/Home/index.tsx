import { Play } from "phosphor-react";
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
    TaskInput,
} from "./styles";
import { useState } from "react";

const newCicleFormSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
});

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
}

type NewCicleFormData = zod.infer<typeof newCicleFormSchema>; // typeof é sempre que quiser usar uma var js no ts
export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const { register, handleSubmit, watch, reset } = useForm({
        resolver: zodResolver(newCicleFormSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    function handleCreateNewCycle(data: NewCicleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
        };
        setCycles((state) => [...state, newCycle]); // sempre que o valor de um estado depender do valor anterior, usar arrow function
        setActiveCycleId(newCycle.id);
        reset();
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    console.log(activeCycle);

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
                        {...register("minutesAmount", { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
                <CountDownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountDownContainer>

                <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    );
}
