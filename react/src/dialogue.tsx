import React, { useState } from 'react';
import { useGlobals, useReactiveValue } from '@reactunity/renderer';
import { useEffect } from 'react';

import './index.scss';

type Message = {
    bg: number;
    speaker: string;
    text: string;
};

let conversations = new Map<string, Message[]>();
conversations["game_intro"] = [
    { bg: 0, speaker: "Handler", text: "You got the package? Good." },
    { bg: 0, speaker: "Handler", text: "You must get it to the Chairman before sundown, which is... in 3 minutes. You got that?" },
    { bg: 0, speaker: "Agent", text: "3 Minutes?!" },
    { bg: 0, speaker: "Handler", text: "Yeah, so step on the gas. And careful with the company car -- we'll be deducting the repair fees from your pay." },
    { bg: 0, speaker: "Handler", text: "Use [W] [A] [S] [D] keys to move." }
];
// conversations["boost_intro"] = [
//     { bg: 0, speaker: "Handler", text: "Buddy, could you be going any slower?! At this rate you're never gonna make it!" },
//     { bg: 0, speaker: "Handler", text: "Look, I made some calls and got them to unlock your car's boost ability. \nIsn't over-the-air updates great?" },
//     { bg: 0, speaker: "", text: "Your car can now go faster. Use [W] to accelerate." },
// ];
conversations["delivery_intro"] = [
    { bg: 0, speaker: "Handler", text: "Buddy, could you be going any slower?! At this rate you're never gonna make it!" },
    { bg: 0, speaker: "Agent", text: "What do you want me to do? The car only goes so fast!" },
    { bg: 0, speaker: "Handler", text: "Hey, don't worry. \nYou know how there's a deadly disease spreading around the city, and our corporation has a monopoly on the cure?" },
    { bg: 0, speaker: "Agent", text: "And that's... not worrying." },
    { bg: 0, speaker: "Handler", text: "I worked out a deal with the folks at R&D. \nThey said they'll make your car faster if you help them deliver the cures." },
    { bg: 0, speaker: "Agent", text: "What? How does that work?" },
    { bg: 0, speaker: "Handler", text: "One of those 'over-the-air-update' thing. \nAnyways, they'll 3D print the cures in your car, just yeet those at hospitals along the way." },
    { bg: 0, speaker: "", text: "Press [E] to deliver a cure. Each successful delivery boosts your max speed." },
];
conversations["jump_intro"] = [
    { bg: 0, speaker: "Handler", text: "Looks like there's a lot of traffic ahead." },
    { bg: 0, speaker: "Agent", text: "Yeah I can't get past that no matter how fast I go." },
    { bg: 0, speaker: "Handler", text: "I'll get them to unlock your car's vertical mobility system. That should help you out." },
    { bg: 0, speaker: "", text: "Press [Space] to jump." },
];
// conversations["unlimited_intro"] = [
//     { bg: 0, speaker: "Handler", text: "You still got a long way to go man." },
//     { bg: 0, speaker: "Handler", text: "Here, my final gift for you. I got them to remove all speed limits on your car. You'd better make it with this. Our careers depend on it." },
//     { bg: 0, speaker: "", text: "Your car no longer has a speed limit." },
// ];
conversations["ending_good"] = [
    { bg: 1, speaker: "Agent", text: "Mr. Chairman? I have the delivery for you." },
    { bg: 1, speaker: "Chairman", text: "Ah! Ice cream from The Scoop. A special treat!" },
    { bg: 2, speaker: "Chairman", text: "And it hasn't melted yet. Well done agent. We'll give you a promotion." },
];
conversations["ending_bad"] = [
    { bg: 1, speaker: "Agent", text: "Mr. Chairman? Express delivery for you." },
    { bg: 1, speaker: "Chairman", text: "Ah! Ice cream from The Scoop. A special treat!" },
    { bg: 2, speaker: "Chairman", text: "What is this? It's all MELTED! Have this guy fired!" },
];

export default function Dialogue(): React.ReactNode {
    const globals = useGlobals();
    const continueValue: number = useReactiveValue(globals.continue);

    const conversationKey: string = useReactiveValue(globals.conversationKey);
    const [index, setIndex] = useState(0);

    const currentConversation = conversations[conversationKey];
    const currentMessage = currentConversation ? currentConversation[index] : null;
    const hasNext = currentConversation && currentConversation.length > index + 1;

    const handleNext = () => {
        // Advance conversation or call DialogueFinished
        if (hasNext) {
            setIndex(index + 1);
        } else {
            Interop.GetType('ReactUnityBridge').DialogueFinished()
        }
    }

    useEffect(() => {
        if (continueValue > 0) {
            handleNext();
            Interop.GetType('ReactUnityBridge').ResetContinue();
        }
    }, [continueValue, handleNext]);

    return (
        <view className="dialogue-background">
            <view className="dialogue-bar">
                <view className="content">
                    <h1 className="title">{currentMessage ? currentMessage.speaker : ""}</h1>
                    <view className="gradient-rule"></view>
                    <p className="message">{currentMessage ? currentMessage.text : ""}</p>
                </view>
                <button onClick={() => handleNext()}>
                    {hasNext ? "CONTINUE" : "START"}
                </button>
            </view>
        </view>
    );
}