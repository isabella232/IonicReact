import React, {useEffect, useState} from 'react';
import './ExploreContainer.css';
import {
    IonList,
    IonItem,
    IonButton,
    IonPopover,
    IonInput,
    IonLabel,
    IonFabButton, IonFab
} from '@ionic/react';
import {getData, postData, putData} from "../Logic/Networking";

interface User {
    id: number,
    name: string,
    password: string,
    icon: string,
    favorites: [],
    date: Date,
    archived: boolean;
}

interface ContainerProps {
    userTokenCallback: (id: number) => void;
    isAuthedCallback: (isAuthed: boolean) => void;
    isAuthed: boolean;
}

const Users: React.FC<ContainerProps> = ({ userTokenCallback, isAuthedCallback, isAuthed}) => {
    const [showPopover, setShowPopover] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>();
    const [id,setId] = useState<number>(0);
    const [showEditPopover, setShowEditPopover] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        getData('/api/users', setUsers);
    }, []);

    function deleteUser(id: number, index: number) {
        setId(id);
        let data = users[index] as User;
        data.archived = true;
        putData('/api/user/'+id,data,resetArchived);
    }

    function resetArchived() {
        setId(0);
    }

    function calcID() {
        if (users.length > 0 ){
            return 1+Math.max.apply(Math, users.map((user) => {return user.id;}));
        } else {
            return 0;
        }
    }

    function submitNewUser() {
        let newUser = {
            id: calcID(),
            name: username,
            password: password,
            icon: "",
            favorites: [],
            date: new Date(),
            archived: false
        } as User;
        postData('/api/user/create',newUser,null);
        console.log("new user submitted");
        setShowPopover(false);
        setUsername("");
        setPassword("");
        let dataArray = users;
        dataArray.push(newUser);
        setUsers(dataArray);
    }

    function loginAsUser(id: number) {
        userTokenCallback(id);
        console.log("USER SET: " + id);
        isAuthedCallback(true);
    }

    function edit(id: number, index: number) {
        setUser(users[index]);
        setId(id);
        setShowEditPopover(true);
    }

    function saveEdit(id: number,
                      name: string,
                      password: string
    ) {
        let data = user as User;
        data.name = name;
        data.password = password;
        data.icon = "";
        data.favorites = [];
        putData('/api/user/'+id,data,null);
        setShowEditPopover(false);
        setUsername("");
        setPassword("");
        console.log("user saved");
    }

    function generateUsers() {
        if (users.length > 0){
            if (isAuthed){
                return users.map((data,index) => {
                    if (!data.archived){
                        let date = new Date(data.date);
                        return <IonItem key={index}>
                            <IonLabel>
                                <h2>{data.name}</h2>
                                <h3>{"Created: " + date.getUTCHours() + ":" + date.getUTCMinutes() + ", " +
                                date.getUTCDay() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear()}</h3>
                                <IonButton color="secondary" onClick={() => edit(data.id,index)}>Edit</IonButton>
                                <IonButton color="danger" onClick={() => deleteUser(data.id,index)}>Delete</IonButton>
                            </IonLabel>
                        </IonItem>
                    } else {
                        return null;
                    }
                });
            } else {
                return users.map((data,index) => {
                    if (!data.archived){
                        return <IonItem key={index}>
                            <IonLabel>
                                <h2>{data.name}</h2>
                                <IonButton color="success" onClick={() => loginAsUser(data.id)}>Login</IonButton>
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

    return (
        <div>
            <IonPopover
                isOpen={showPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowPopover(false)}
            >
                <h5>Please fill out the fields below...</h5>
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
            <IonPopover
                isOpen={showEditPopover}
                cssClass='my-custom-class'
                onDidDismiss={() => setShowEditPopover(false)}
            >
                <h5>Edit the user fields below</h5>
                <IonList>
                    <IonItem>
                        <IonInput value={username} placeholder="Change username"
                                  onIonChange={e => setUsername(e.detail.value!)}/>
                    </IonItem>
                    <IonItem>
                        <IonInput value={password} placeholder="Change password" type="password"
                                  onIonChange={e => setPassword(e.detail.value!)}/>
                    </IonItem>
                    <IonButton onClick={() => saveEdit(id,username,password)}>Save</IonButton>
                </IonList>
            </IonPopover>
            <IonList>
                {generateUsers()}
            </IonList>
            <IonFab>
                <IonFabButton class="fabBtn" onClick={() => setShowPopover(true)}>+</IonFabButton>
            </IonFab>
        </div>
    );
};
export default Users;
