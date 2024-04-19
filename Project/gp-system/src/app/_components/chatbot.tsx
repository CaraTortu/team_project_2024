"use client";
import {
    Children,
    type ReactElement,
    cloneElement,
    useState,
    useEffect,
    useRef,
} from "react";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { FaRobot } from "react-icons/fa";
import { api } from "~/trpc/react";

interface Actions {
    handleMessage: (message: string) => void;
}

function useTimeout(callback: () => void, delay: number) {
    const timeoutRef = useRef<number | undefined>(undefined);
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        const tick = () => savedCallback.current();
        timeoutRef.current = window.setTimeout(tick, delay);
        return () => window.clearTimeout(timeoutRef.current);
    }, [delay]);
    return timeoutRef;
}

export const Chat = () => {
    const [showChat, setShowChat] = useState(false);
    const [beenOpened, setBeenOpened] = useState(true);
    const getResponse = api.chat.getResponse.useMutation();
    const initial_messages = [createChatBotMessage("Hello there!", {})];

    useTimeout(() => setBeenOpened(false), 5000);

    const ActionProvider = ({
        children,
        setState,
        state,
    }: {
        children: ReactElement;
        setState: any;
        state: { messages: typeof initial_messages };
    }) => {
        const handleMessage = async (message: string) => {
            const botMessage = await getResponse.mutateAsync({
                query: message,
                messages: state.messages.map((msg) => ({
                    role: msg.type == "bot" ? "assistant" : "user",
                    content: msg.message,
                })),
            });

            setState((prev: { messages: typeof initial_messages }) => {
                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        createChatBotMessage(
                            botMessage.choices[0]?.message.content ?? "",
                            {},
                        ),
                    ],
                };
            });
        };

        return (
            <div>
                {Children.map(children, (child) => {
                    return cloneElement(child, {
                        actions: {
                            handleMessage,
                        } satisfies Actions,
                    });
                })}
            </div>
        );
    };

    const MessageParser = ({
        children,
        actions,
    }: {
        children: ReactElement;
        actions: Actions;
    }) => {
        const parse = (message: string) => actions.handleMessage(message);

        return (
            <div>
                {Children.map(children, (child) => {
                    return cloneElement(child, {
                        parse: parse,
                        actions,
                    });
                })}
            </div>
        );
    };

    return (
        <div className="fixed bottom-2 right-2 z-[100] flex flex-col items-end gap-2">
            <div className={showChat ? "" : "hidden"}>
                <Chatbot
                    config={{
                        initialMessages: initial_messages,
                        botName: "GPBot",
                    }}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                />
            </div>

            <div
                onClick={() => {
                    setShowChat(!showChat);
                    setBeenOpened(true);
                }}
                className="relative"
            >
                {!beenOpened && (
                    <p className="fixed bottom-12 right-2 z-20 rounded-full bg-red-500 px-1 text-white">
                        1
                    </p>
                )}
                <FaRobot
                    size="3.5rem"
                    className="rounded-full bg-black p-2 duration-300 hover:bg-gray-800"
                    color="white"
                />
            </div>
        </div>
    );
};
