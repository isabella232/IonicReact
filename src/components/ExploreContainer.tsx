import React from 'react';
import './ExploreContainer.css';
import Users from "./Users";
import Topics from "./Topics";
import Messages from "./Messages";
import Archived from "./Archived";

interface ContainerProps {
    name: string;
    isAuthed: boolean;
    userTokenCallback: (id: number) => void;
    isAuthedCallback: (isAuthed: boolean) => void;
    userToken: number;
    topicToken: number;
    topicTokenCallback: (id: number) => void;
    updateMenuCallback: (bool: boolean) => void;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name,
                                                        isAuthed,
                                                        isAuthedCallback,
                                                        userTokenCallback,
                                                        userToken,
                                                        topicToken,
                                                        topicTokenCallback, updateMenuCallback
}) => {
    function generateContent() {
        switch (name) {
            case "users":
                return <Users
                    userTokenCallback={userTokenCallback} isAuthedCallback={isAuthedCallback} isAuthed={isAuthed}/>
            case "topics":
                return <Topics isAuthed={isAuthed}
                               topicTokenCallback={topicTokenCallback} userToken={userToken}
                               updateMenuCallback={updateMenuCallback}
                />
            case "Messages":
                return <Messages isAuthed={isAuthed} userToken={userToken} topicToken={topicToken}
                />
            case "archived":
                return <Archived isAuthed={isAuthed} userToken={userToken} />
            default:
                return <div />
        }
    }

    return generateContent();
};

export default ExploreContainer;
