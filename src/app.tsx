import { Text, Window, hot, View, Button, Tabs, TabItem } from "@nodegui/react-nodegui";
//import { QPushButtonSignals } from '@nodegui/nodegui';
import React, { useState, useEffect } from "react";
import { QIcon } from "@nodegui/nodegui";
//import { QMessageBox, ButtonRole, QPushButton } from "@nodegui/nodegui";
import { StepOne } from "./components/stepone";
import { StepTwo } from "./components/steptwo";
import nodeguiIcon from "../assets/nodegui.jpg";
import axios from 'axios';
import AddTaskForm from './components/AddTaskForm';

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}


const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      console.log("Response from server:", response.data);
      setTasks(response.data);
      console.log('State after fetchTasks:', tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      const response = await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks();   // refresh the tasks list
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  }

  return (
    <Window
      id="mainWindow"
      windowIcon={winIcon}
      windowTitle="Hello 👋🏽"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <Tabs id="tabs">
        <TabItem title="Settings">
          <View>
            <Text>hello</Text>
          </View>
        </TabItem>
        <TabItem title="Task List">
          <View style={containerStyle}>
            {tasks.map(task => (
              <View id="taskList" key={task._id}>
                <Button id="iconButton" text="❎" on={{clicked: () => deleteTask(task._id)}} />
                <Text>{task.title}</Text>
              </View>
            ))}
            <AddTaskForm onTaskAdded={() => fetchTasks()} />
            <Button id="textButton" text="Refresh" on={{clicked: () => fetchTasks()}} />
            {/*
            <Text id="step-1">1. Play around</Text>
            <StepOne />
            <Text id="step-2">2. Debug</Text>
            <StepTwo />
            */}
          </View>
        </TabItem>
      </Tabs>
    </Window>
  );
};

const containerStyle = `
  flex: 1; 
`;

const styleSheet = `
  #mainWindow {
    background-color: #cfc7be;
  }
  
  #tabs {
    background-color: #dad6cd;
  }

  #tabs QTabBar::tab {
    background-color: #cfc7be;
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
  
  #taskList {
    flex-direction: 'row';
    align-items: 'center';
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

