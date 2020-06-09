import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {
    IonAvatar, IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader
} from "@ionic/react";
import {deleteData, getData, putData} from "../Logic/Networking";

interface ContainerProps {
    isAuthed: boolean;
    userToken: number;
}

interface User {
    id: number;
    name: string;
    password: string;
    icon: string;
    favorites: [];
    date: Date;
    archived: boolean;
}

interface Topic {
    id: number;
    name: string;
    favorites: [];
    date: Date;
    description: string;
    archived: boolean;
}

interface Message {
    id: number;
    author: User;
    timestamp: Date;
    topic: Topic;
    content: string;
    likes: User[];
    dislikes: User[];
    archived: boolean;
}

const Archived: React.FC<ContainerProps> = ({ isAuthed, userToken}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [id,setId] = useState<number>(0);

    useEffect(() => {
        getData('/api/messages', setMessages);
        getData('/api/users', setUsers);
        getData('/api/topics', setTopics);
    },[id]);

    function resetArchived() {
        setId(0);
    }

    function restoreMessage(id: number, index: number) {
        setId(id);
        let data = messages[index] as Message;
        data.archived = false;
        putData('/api/message/'+id,data,resetArchived);
    }

    function deleteMessage(id: number) {
        deleteData('/api/message/' + id);
        setMessages(messages.filter((e) => (e.id !== id)));
    }

    function restoreUser(id: number, index: number) {
        setId(id);
        let data = users[index] as User;
        data.archived = false;
        putData('/api/user/'+id,data,resetArchived);
    }

    function deleteUser(id: number) {
        deleteData('/api/user/' + id);
        setUsers(users.filter((e) => (e.id !== id)));
    }

    function restoreTopic(id: number, index: number) {
        setId(id);
        let data = topics[index] as Topic;
        data.archived = false;
        putData('/api/topic/'+id,data,resetArchived);
    }

    function deleteTopic(id: number) {
        deleteData('/api/topic/' + id);
        setTopics(topics.filter((e) => (e.id !== id)));
    }

    function generateMessages() {
        return messages.map((data,index) => {
            if (data.author.id == userToken && data.archived){
                return <IonItem key={index}>
                    <IonAvatar slot="start">
                        <img src={"https://api.adorable.io/avatars/285/"+ Math.random() +".png"} alt="avatar" />
                    </IonAvatar>
                    <IonLabel>
                        <h2>{data.author.name}</h2>
                        <h3>{data.timestamp}</h3>
                        <p>{data.content}</p>
                        <IonButton color="success" onClick={() => restoreMessage(data.id,index)}>
                            Restore
                        </IonButton>
                        <IonButton color="danger" onClick={() => deleteMessage(data.id)}>
                            Permanent Delete
                        </IonButton>
                    </IonLabel>
                </IonItem>
            } else {
                return null;
            }
        });
    }

    function generateUsers() {
        return users.map((data,index) => {
            if (data.archived){
                return <IonItem key={index}>
                    <IonAvatar slot="start">
                        <img src={"https://api.adorable.io/avatars/285/"+ Math.random() +".png"} alt="avatar" />
                    </IonAvatar>
                    <IonLabel>
                        <h2>{data.name}</h2>
                        <h3>{data.date}</h3>
                        <IonButton color="success" onClick={() => restoreUser(data.id,index)}>
                            Restore
                        </IonButton>
                        <IonButton color="danger" onClick={() => deleteUser(data.id)}>
                            Permanent Delete
                        </IonButton>
                    </IonLabel>
                </IonItem>
            } else {
                return null;
            }
        });
    }

    function generateTopics() {
        return topics.map((data,index) => {
            if (data.archived){
                return <IonItem key={index}>
                    <IonLabel>
                        <h2>{data.name}</h2>
                        <h3>{data.date}</h3>
                        <p>{data.description}</p>
                        <IonButton color="success" onClick={() => restoreTopic(data.id,index)}>
                            Restore
                        </IonButton>
                        <IonButton color="danger" onClick={() => deleteTopic(data.id)}>
                            Permanent Delete
                        </IonButton>
                    </IonLabel>
                </IonItem>
            } else {
                return null;
            }
        });
    }

    if (isAuthed){
        return <IonList>
            <IonListHeader>
                <h1>Your Archived Messages</h1>
            </IonListHeader>
            {generateMessages()}
            <IonListHeader>
                <h1>Archived Users</h1>
            </IonListHeader>
            {generateUsers()}
            <IonListHeader>
                <h1>Archived Topics</h1>
            </IonListHeader>
            {generateTopics()}
        </IonList>
    } else {
        return <h1>Please login to continue</h1>
    }
};
export default Archived;