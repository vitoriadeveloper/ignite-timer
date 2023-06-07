import { HandPalm, Play } from "phosphor-react";
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDownt";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from "zod";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCicleFormSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(1).max(60),
});

type NewCicleFormData = zod.infer<typeof newCicleFormSchema>; // typeof é sempre que quiser usar uma var js no ts

export function Home() {
    const { createNewCycle, interruptCurrentCycle, activeCycle } =
        useContext(CyclesContext);
    const newCycleForm = useForm<NewCicleFormData>({
        resolver: zodResolver(newCicleFormSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });
    const { reset, handleSubmit, watch } = newCycleForm;

    function handleCreateNewCycle(data: NewCicleFormData) {
        createNewCycle(data);

        reset();
    }
    const task = watch("task");
    const isSubmitDisabled = !task;
    return (
        <HomeContainer>
            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton
                        type="button"
                        onClick={interruptCurrentCycle}
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
export { CyclesContext };
