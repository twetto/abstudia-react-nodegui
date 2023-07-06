import { Text, Window, hot, View, Button } from "@nodegui/react-nodegui";
import { QPushButtonSignals } from '@nodegui/nodegui';
import React, { useState, useEffect } from "react";
import { QIcon } from "@nodegui/nodegui";
import { StepOne } from "./components/stepone";
import { StepTwo } from "./components/steptwo";
import nodeguiIcon from "../assets/nodegui.jpg";
import axios from 'axios';

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
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
          <Text key={task._id}>{task.title}</Text>
        ))}
        <Button text="Refresh" on={{clicked: () => fetchTasks()}} />
        <Text id="step-1">1. Play around</Text>
        <StepOne />
        <Text id="step-2">2. Debug</Text>
        <StepTwo />
      </View>
    </Window>
  );
}

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
