import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {
    IonAvatar,
    IonButton,
    IonFab,
    IonFabButton, IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPopover
} from "@ionic/react";
import {getData, postData, putData} from "../Logic/Networking";
import {useLocation} from "react-router";
import {thumbsDown, thumbsUp} from "ionicons/icons";

interface ContainerProps {
    isAuthed: boolean;
    userToken: number;
    topicToken: number;
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

const Messages: React.FC<ContainerProps> = ({ isAuthed, userToken, topicToken
}) => {
    const [showPopover, setShowPopover] = useState(false);
    const [topic, setTopic] = useState<Topic>();
    const [showEditPopover, setShowEditPopover] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message>();
    const [id,setId] = useState<number>(0);
    const [user, setUser] = useState<User>();
    const [content, setContent] = useState<string>("");
    let url = useLocation().pathname;

    useEffect(() => {
        getData(url, setMessages);
        getData('/api/Messages', setAllMessages)
        getData('/api/user/'+ userToken, setUser);
        getData('/api/topic/'+topicToken, setTopic)
    }, [url,topicToken,userToken]);

    function calcID() {
        if (allMessages.length > 0 ){
            return 1+Math.max.apply(Math, allMessages.map((message) => {return message.id;}));
        } else {
            return 0;
        }
    }

    function submit() {
        console.log("all messages length: " + allMessages.length);
        if (user !== undefined && topic !== undefined){
            let newMessage = {
                id: calcID(),
                author: user,
                timestamp: new Date(),
                topic: topic,
                content: content,
                likes: [],
                dislikes: [],
                archived: false
            } as Message;
            postData('/api/message/create',newMessage,null);
            allMessages.push(newMessage);
            messages.push(newMessage);
            console.log("new message submitted");
            setShowPopover(false);
            setContent("");
        }
    }

    function saveEdit(id: number, content: string) {
        let data = message as Message;
        data.content = content;
        putData('/api/message/'+id,data,null);
        setShowEditPopover(false);
        setContent("");
        console.log("message saved");
    }

    function generateButtons(author: number, id: number, index: number) {
        if (author == userToken){
            return <IonLabel>
                <IonButton color="secondary" onClick={() => editMessage(id,index)}>Edit</IonButton>
                <IonButton color="danger" onClick={() => deleteMessage(id,index)}>Delete</IonButton>
            </IonLabel>
        } else {
            return null;
        }
    }

    function getThumbsUp(message: Message) {
        if (user && message.likes.filter((user) => user.id == userToken).length < 1){
            console.log("thumbs up");
            let data = message;
            setId(user.id);
            data.likes.push(user);
            if (data.dislikes.filter((user) => user.id == userToken).length > 0){
                data.dislikes.splice(
                    data.dislikes.findIndex((user) => user.id == userToken),1);
            }
            putData('/api/message/'+message.id,data,resetArchived);
        }
    }

    function getThumbsDown(message: Message) {
        if (user && message.dislikes.filter((user) => user.id == userToken).length < 1){
            let data = message;
            console.log("thumbs down");
            setId(user.id);
            data.dislikes.push(user);
            if (data.likes.filter((user) => user.id == userToken).length > 0){
                data.likes.splice(
                    data.likes.findIndex((user) => user.id == userToken),1);
            }
            putData('/api/message/'+message.id,data,resetArchived);
        }
    }

    function generateMessages() {
        if (messages.length > 0){
            if (isAuthed){
                return messages.sort((a,b) => {
                    return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? 1 : -1;
                }).map((data,index) => {
                    if (!data.archived){
                        let date = new Date(data.timestamp);
                        return <IonItem key={index}>
                            <IonAvatar>
                                <img src={"https://api.adorable.io/avatars/285/"+ Math.random() +".png"}
                                     alt="avatar" />
                            </IonAvatar>
                            <IonLabel>
                                <h3>{data.author.name}</h3>
                                <p>{"Created: " + date.getUTCHours() + ":" + date.getUTCMinutes() + ", " +
                                date.getUTCDay() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear()}</p>
                                <h2>{data.content}</h2>
                            </IonLabel>
                            <IonLabel>
                                <IonButton size="small" shape="round"
                                           onClick={() => getThumbsUp(data)}>
                                    <IonIcon slot="start" icon={thumbsUp} />
                                </IonButton>
                                <h2>{"Likes: " + data.likes.length}</h2>
                                <IonButton size="small" shape="round"
                                           onClick={() => getThumbsDown(data)}>
                                    <IonIcon icon={thumbsDown} />
                                </IonButton>
                                <h2>{"Dislikes: " + data.dislikes.length}</h2>
                            </IonLabel>
                            {generateButtons(data.author.id,data.id,index)}
                        </IonItem>
                    } else {
                        return null;
                    }
                });
            } else {
                return <div />
            }
        } else {
            return <div><h1>Empty Board! Please leave the first message...</h1></div>;
        }
    }

    function editMessage(id: number, index: number) {
        setMessage(messages[index]);
        setId(id);
        setShowEditPopover(true);
    }

    function deleteMessage(id: number, index: number) {
        setId(id);
        let data = messages[index] as Message;
        data.archived = true;
        putData('/api/message/'+id,data,resetArchived);
    }

    function resetArchived() {
        setId(0);
    }

    if (isAuthed){
        return <div>
            <IonPopover
                isOpen={showPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowPopover(false)}
            >
                <h5>Write a message!</h5>
                <IonList>
                    <IonItem>
                        <IonInput value={content} placeholder="Enter a message"
                                  onIonChange={e => setContent(e.detail.value!)}/>
                    </IonItem>
                    <IonButton onClick={submit}>Submit</IonButton>
                </IonList>
            </IonPopover>
            <IonPopover
                isOpen={showEditPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowEditPopover(false)}
            >
                <h5>Edit the message using the fields below</h5>
                <IonList>
                    <IonItem>
                        <IonInput value={content} placeholder="Enter a message"
                                  onIonChange={e => setContent(e.detail.value!)}/>
                    </IonItem>
                    <IonButton onClick={() => saveEdit(id,content)}>Save</IonButton>
                </IonList>
            </IonPopover>
            <IonList>
                {generateMessages()}
            </IonList>
            <IonFab>
                <IonFabButton class="fabBtn" onClick={() => setShowPopover(true)}>+</IonFabButton>
            </IonFab>
        </div>
    } else {
        return <h1>Please login to continue</h1>
    }
};
export default Messages;