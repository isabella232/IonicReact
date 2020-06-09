import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {
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
import {useLocation} from "react-router-dom";
import {heartDislike, heartSharp} from "ionicons/icons";

interface ContainerProps {
    isAuthed: boolean;
    topicTokenCallback: (id: number) => void;
    userToken: number;
    updateMenuCallback: (bool: boolean) => void;
}

interface Topic {
    id: number;
    name: string;
    favorites: Topic[];
    date: Date;
    description: string;
    archived: boolean;
}

interface User {
    id: number,
    name: string,
    password: string,
    icon: string,
    favorites: Topic[],
    date: Date,
    archived: boolean;
}

const Topics: React.FC<ContainerProps> = ({ isAuthed, topicTokenCallback, userToken, updateMenuCallback
}) => {
    const [showPopover, setShowPopover] = useState(false);
    const location = useLocation();
    const [showEditPopover, setShowEditPopover] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topic, setTopic] = useState<Topic>();
    const [id,setId] = useState<number>(0);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getData('/api/topics', setTopics);
        getData('/api/user/'+userToken,setUser);
    }, [userToken]);

    function topicTokenSetter(id: number) {
        topicTokenCallback(id);
        console.log("TOPIC SET");
    }

    function likeTopic(data: Topic) {
        console.log("LIKE");
        if (user){
            updateMenuCallback(true);
            setId(user.id);
            let changedUser = user;
            changedUser.favorites.push(data);
            putData('/api/user/'+user.id,changedUser,resetArchived);
        }
    }

    function dislikeTopic(data: Topic) {
        console.log("DISLIKE");
        if (user && user.favorites.filter((topic) => topic.id === data.id).length > 0){
            updateMenuCallback(true);
            setId(user.id);
            let changedUser = user;
            changedUser.favorites.splice(
                changedUser.favorites.findIndex((topic) => topic.id === data.id),1);
            putData('/api/user/'+user.id,changedUser,resetArchived);
        }
    }

    function generateFavorite(data: Topic) {
        if (user && user.favorites.filter((topic) => topic.id === data.id).length > 0){
            return <IonIcon slot="start" icon={heartDislike} onClick={() => dislikeTopic(data)} />
        } else {
            return <IonIcon slot="start" icon={heartSharp} onClick={() => likeTopic(data)} />
        }
    }

    function generateTopics() {
        if (topics.length > 0){
            if (isAuthed){
                return topics.map((data,index) => {
                    if (!data.archived){
                        return <IonItem key={index}>
                            <IonLabel>
                                <IonItem routerLink={"/page/Messages/"+data.id}
                                         className={location.pathname === "/page/Messages/"+data.id ? 'selected' : ''}
                                         routerDirection="none" lines="none" detail={false}
                                         button onClick={() => topicTokenSetter(data.id)}>
                                    <IonLabel><h2>{data.name}</h2></IonLabel>
                                </IonItem>
                                <IonItem><h3>{data.description}</h3></IonItem>
                                <IonItem>
                                    {generateFavorite(data)}
                                    <IonButton color="secondary"
                                               onClick={() => editTopic(data.id,index)}>Edit</IonButton>
                                    <IonButton color="danger"
                                               onClick={() => deleteTopic(data.id,index)}>Delete</IonButton>
                                </IonItem>
                            </IonLabel>
                        </IonItem>
                    } else {
                        return null;
                    }
                });
            }
        } else {
            return <div><h1>Loading amazing content!...</h1></div>;
        }
    }

    function editTopic(id: number, index: number) {
        setTopic(topics[index]);
        setId(id);
        setShowEditPopover(true);
    }

    function saveTopicEdit(id: number, title: string, description: string) {
        let data = topic as Topic;
        data.name = title;
        data.description = description;
        putData('/api/topic/'+id,data,null);
        setShowEditPopover(false);
        setTitle("");
        setDescription("");
        console.log("topic saved");
    }

    function calcID() {
        if (topics.length > 0 ){
            return 1+Math.max.apply(Math, topics.map((topic) => {return topic.id;}));
        } else {
            return 0;
        }
    }

    function submit() {
        let newTopic = {
            id: calcID(),
            name: title,
            favorites: [],
            date: new Date(),
            description: description,
            archived: false
        } as Topic;
        postData('/api/topic/create',newTopic,null);
        console.log("new topic submitted");
        setShowPopover(false);
        setTitle("");
        setDescription("");
        let dataArray = topics;
        dataArray.push(newTopic);
        setTopics(dataArray);
    }

    function deleteTopic(id: number, index: number) {
        setId(id);
        let data = topics[index] as Topic;
        data.archived = true;
        putData('/api/topic/'+id,data,resetArchived);
    }

    function resetArchived() {
        setId(0);
        updateMenuCallback(false);
    }

    if (isAuthed){
        return <div>
            <IonPopover
                isOpen={showPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowPopover(false)}
            >
                <h5>Create a topic to discuss!</h5>
                <IonList>
                    <IonItem>
                        <IonInput value={title} placeholder="Enter a Title"
                                  onIonChange={e => setTitle(e.detail.value!)}/>
                    </IonItem>
                    <IonItem>
                        <IonInput value={description} placeholder="Enter a description for the topic"
                                  onIonChange={e => setDescription(e.detail.value!)}/>
                    </IonItem>
                    <IonButton onClick={submit}>Submit</IonButton>
                </IonList>
            </IonPopover>
            <IonPopover
                isOpen={showEditPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowEditPopover(false)}
            >
                <h5>Edit the topic using the fields below</h5>
                <IonList>
                    <IonItem>
                        <IonInput value={title} placeholder="Enter a Title"
                                  onIonChange={e => setTitle(e.detail.value!)}/>
                    </IonItem>
                    <IonItem>
                        <IonInput value={description} placeholder="Enter a description for the topic"
                                  onIonChange={e => setDescription(e.detail.value!)}/>
                    </IonItem>
                    <IonButton onClick={() => saveTopicEdit(id,title,description)}>Save</IonButton>
                </IonList>
            </IonPopover>
            <IonList>
                {generateTopics()}
            </IonList>
            <IonFab>
                <IonFabButton class="fabBtn" onClick={() => setShowPopover(true)}>+</IonFabButton>
            </IonFab>
        </div>
    } else {
        return <h1>Please login to continue</h1>
    }
};
export default Topics;