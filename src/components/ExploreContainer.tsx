import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {
    IonList,
    IonItem,
    IonButton,
    IonPopover,
    IonInput,
    IonAvatar,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent, IonListHeader, IonFabButton, IonFab, IonFooter
} from '@ionic/react';
import {getData, postData} from "../Logic/Networking";

interface ContainerProps {
  name: string;
}

interface User {
    id: number,
    name: string,
    password: string,
    icon: string,
    favorites: [],
    date: number
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
    const [showPopover, setShowPopover] = useState(false);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getData('/api/users', setUsers);
    }, [!showPopover]);

    function submitNewUser() {
        let newUser = {
            id: 1+users.length,
            name: username,
            password: password,
            icon: "",
            favorites: [],
            date: new Date()
        };
        postData('/api/user/create',newUser,null,users);
        console.log("new user submitted");
        setShowPopover(false);
        setUsername("");
        setPassword("");
    }

    function generateUsers() {
        if (users !== null && users !== undefined){
            return users.map((data,index) => {
                return <IonItem key={index}>
                    <IonLabel>
                        <h2>{data.name}</h2>
                        <h3>{data.id}</h3>
                        <p>{data.date}</p>
                    </IonLabel>
                </IonItem>
            });
        } else {
            return null;
        }
    }

  return (
    <div>
        <IonPopover
            isOpen={showPopover}
            cssClass='my-custom-class'
            onDidDismiss={() => setShowPopover(false)}
        >
            <p>Please fill out the fields below...</p>
            <IonList>
                <IonItem>
                    <IonInput value={username} placeholder="Enter Username"
                              onIonChange={e => setUsername(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonInput value={password} placeholder="Enter Password" type="password"
                              onIonChange={e => setPassword(e.detail.value!)}/>
                </IonItem>
                <IonButton onClick={submitNewUser}>Submit</IonButton>
            </IonList>
        </IonPopover>
        <IonList>
            {generateUsers()}
        </IonList>
        <IonFab>
            <IonFabButton id="fabBtn" onClick={() => setShowPopover(true)}>+</IonFabButton>
        </IonFab>
    </div>
  );
};

export default ExploreContainer;
