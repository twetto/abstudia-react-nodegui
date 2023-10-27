import { Text, Window, hot, View, Button, Tabs, TabItem } from "@nodegui/react-nodegui";
import React, { useState, useEffect, useContext } from "react";
import { QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
import axios from 'axios';
import SessionContext from './SessionContext';
import Settings from './components/Settings';
import TaskList from './components/TaskList';
import EisenhowerMatrix from './components/EisenhowerMatrix';

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);

const App = () => {

  // states
  const [session, setSession] = useState({ website: '', cookies: {} });
  const sessionContext = useContext(SessionContext);

  const updateSession = (website: string, cookies: any) => {
    setSession({ website, cookies });
  }

  useEffect(() => {
  });

  return (
    <SessionContext.Provider value={{ ...session, setSession: updateSession }}>
      <Window
        id="mainWindow"
        windowIcon={winIcon}
        windowTitle="Hello 👋🏽"
        minSize={minSize}
        styleSheet={styleSheet}
      >
        <Tabs id="tabs">
          <TabItem title="Settings">
            <Settings />
          </TabItem>
          <TabItem title="Task List">
            {/*<View style={containerStyle}>*/}
            <TaskList />
            {/*</View>*/}
          </TabItem>
          <TabItem title="E-Matrix">
            <EisenhowerMatrix />
          </TabItem>
        </Tabs>
      </Window>
    </SessionContext.Provider>
  );
};

//const containerStyle = `
//  flex: 1; 
//`;

const styleSheet = `
  #mainWindow {
    background-color: #cfc7be;
  }
  
  #tabs {
    background-color: #dad6cd;
  }

  #tabs QTabBar::tab {
    background-color: #cfc7be;
    border: 5px;
    padding: 5px;
    margin: 5px;
    margin-top: 3px;
    border-radius: 3px;
  }

  #tabs QTabBar::tab:selected {
    background-color: #e6e3dc;
  }

  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }

  #step-1, #step-2 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }
  
  #iconButton {
    background-color: #d4d1c8;
;
    border: 0px;
    padding: 2px;
    margin: 0px;
    margin-left: 5px;
    margin-right: 2px;
    border-radius: 3px;
  }
  
  #iconButton:hover {
    background-color: #f8f8f6;
  }

  #iconButton:hover:pressed {
    background-color: #5b8089;
  }

  #textButton {
    background-color: #d4d1c8;
    border: 0px;
    padding: 5px;
    margin: 5px;
    border-radius: 3px;
  }
  
  #textButton:hover {
    background-color: #f8f8f6;
  }

  #textButton:hover:pressed {
    color: white;
    background-color: #5b8089;
  }

  #lineEdit {
    background-color: #f8f8f6;
    selection-background-color: #5b8089;
    border: 0px;
    padding: 1px;
    margin: 0px;
    border-radius: 3px;
  }

`;

export default hot(App);

