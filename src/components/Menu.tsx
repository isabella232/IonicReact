import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  newspaperOutline, newspaperSharp,
  personOutline, personSharp
} from 'ionicons/icons';
import './Menu.css';
import {getData} from "../Logic/Networking";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'users',
    url: '/page/users',
    iosIcon: personOutline,
    mdIcon: personSharp
  },
  {
    title: 'topics',
    url: '/page/topics',
    iosIcon: newspaperOutline,
    mdIcon: newspaperSharp
  },
  {
    title: 'archived',
    url: '/page/archived',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  }
];

interface ContainerProps {
  isAuthed: boolean;
  userToken: number;
  userTokenCallback: (id: number) => void;
  isAuthedCallback: (isAuthed: boolean) => void;
  updateMenu: boolean;
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
  favorites: [],
  date: Date,
  archived: boolean;
}

const Menu: React.FC<ContainerProps> =
    ({ isAuthed, userToken, userTokenCallback, isAuthedCallback, updateMenu }) => {
  const [user, setUser] = useState<User>();
  const location = useLocation();

  useEffect(() => {
    getData('/api/user/' + userToken,setUser);
  }, [isAuthed,userToken,updateMenu]);

  function logout() {
    userTokenCallback(0);
    console.log("USER ZEROED");
    isAuthedCallback(false);
  }

  if (isAuthed && user !== undefined && user !== null){
    return (
        <IonMenu contentId="main" type="overlay">
          <IonContent>
            <IonList id="inbox-list">
              <IonListHeader>Modus Messenger</IonListHeader>
              <IonNote>{user.name}</IonNote>
              {appPages.map((appPage, index) => {
                return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url}
                               routerDirection="none" lines="none" detail={false}>
                        <IonIcon slot="start" icon={appPage.iosIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                );
              })}
            </IonList>
            <IonList id="labels-list">
              <IonListHeader>Favorites</IonListHeader>
              {user.favorites.map((topic: Topic, index: number) => (
                  <IonItem lines="none" key={index} routerLink={"/page/Messages/"+topic.id}
                           className={location.pathname === "/page/Messages/"+topic.id ? 'selected' : ''}
                           routerDirection="none" detail={false}>
                    <IonIcon slot="start" icon={bookmarkOutline} />
                    <IonLabel>{topic.name}</IonLabel>
                  </IonItem>
              ))}
            </IonList>
            <IonButton id="logoutBtn" color="secondary" onClick={() => logout()}>Logout</IonButton>
          </IonContent>
        </IonMenu>
    );
  } else {
    return (
        <IonMenu contentId="main" type="overlay">
          <IonContent>
            <IonList id="inbox-list">
              <IonListHeader>Modus Messenger</IonListHeader>
              <IonNote>Please Login</IonNote>
              {
                <IonMenuToggle autoHide={false}>
                  <IonItem className={location.pathname === appPages[0].url ? 'selected' : ''}
                           routerLink={appPages[0].url}
                           routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" icon={appPages[0].iosIcon} />
                    <IonLabel>{appPages[0].title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              }
            </IonList>
          </IonContent>
        </IonMenu>
    );
  }
};

export default Menu;
