import { Text, Window, hot, View, Button } from "@nodegui/react-nodegui";
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
      windowIcon={winIcon}
      windowTitle="Hello 👋🏽"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
        <Text id="welcome-text">Welcome to NodeGui 🐕</Text>
        {tasks.map(task => (
          <View style="flex-direction: 'row'; align-items: 'center';" key={task._id}>
            <Button style="margin-left: 5px; margin-right: 5px;" text="❎" on={{clicked: () => deleteTask(task._id)}} />
            <Text>{task.title}</Text>
          </View>
        ))}
        <AddTaskForm onTaskAdded={() => fetchTasks()} />
        <Button text="Refresh" on={{clicked: () => fetchTasks()}} />
        <Text id="step-1">1. Play around</Text>
        <StepOne />
        <Text id="step-2">2. Debug</Text>
        <StepTwo />
      </View>
    </Window>
  );
};

const containerStyle = `
  flex: 1; 
`;

const styleSheet = `
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
`;

export default hot(App);

