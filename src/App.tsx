import Menu from './components/Menu';
import Page from './pages/Page';
import React, {useState} from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => {
  const [userToken, setUserToken] = useState<number>(0);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [topicToken, setTopicToken] = useState<number>(0);
  const [updateMenu, setUpdateMenu] = useState<boolean>(false);

  function topicTokenCallback(id: number) {
    setTopicToken(id);
  }

  function userTokenCallback(id: number) {
    setUserToken(id);
  }

  function isAuthedCallback(isAuthed: boolean) {
    setIsAuthed(isAuthed);
  }

  function updateMenuCallback(bool: boolean) {
    setUpdateMenu(bool);
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu isAuthed={isAuthed} userToken={userToken}
                userTokenCallback={userTokenCallback} isAuthedCallback={isAuthedCallback}
                updateMenu={updateMenu}
          />
          <IonRouterOutlet id="main">
            <Route path="/page/:name" render={(props) =>
                <Page {...props} isAuthed={isAuthed}
                      setUserToken={userTokenCallback}
                      setIsAuthed={isAuthedCallback} userToken={userToken} topicToken={topicToken}
                      topicTokenCallback={topicTokenCallback} updateMenuCallback={updateMenuCallback}
                />}/>
            <Redirect from="/" to="/page/Users" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
