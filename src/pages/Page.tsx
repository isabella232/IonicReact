import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

interface ContainerProps {
    isAuthed: boolean
    setUserToken: (id: number) => void;
    setIsAuthed: (isAuthed: boolean) => void;
    userToken: number;
    topicToken: number;
    topicTokenCallback: (id: number) => void;
    updateMenuCallback: (bool: boolean) => void;
}

const Page: React.FC<ContainerProps> = ({ isAuthed,
                                            setUserToken,
                                            setIsAuthed,
                                            userToken,
                                            topicToken, topicTokenCallback, updateMenuCallback
}) => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} isAuthed={isAuthed}
                          isAuthedCallback={setIsAuthed}
                          userTokenCallback={setUserToken}
                          userToken={userToken}
                          topicToken={topicToken}
                          topicTokenCallback={topicTokenCallback} updateMenuCallback={updateMenuCallback}
        />
      </IonContent>
    </IonPage>
  );
};

export default Page;
