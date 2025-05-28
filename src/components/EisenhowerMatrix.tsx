import * as React from 'react';
import axios from 'axios';
import { Button, View, Text } from '@nodegui/react-nodegui';
import { Task } from '../types/Task';
import SessionContext from '../SessionContext';

interface TaskListState {
  tasks: Task[];
}

interface TaskListProps {
}

class EisenhowerMatrix extends React.Component<TaskListProps, TaskListState> {

  static contextType = SessionContext;

  constructor(props: TaskListProps) {
    super(props);
    this.state = {
      tasks: [],
    };

    this.fetchTasks = this.fetchTasks.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const { website, cookies } = this.context;
      const cookiesString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
      const response = await axios.get('/tasks', {
        baseURL: website,
        headers: { 'cookie': cookiesString }
      });
      this.setState({ tasks: response.data });
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }

  render() {
    const { tasks } = this.state;

    const urgentImportant = tasks.filter(task => task.isUrgent && task.isImportant);
    const notUrgentImportant = tasks.filter(task => !task.isUrgent && task.isImportant);
    const urgentNotImportant = tasks.filter(task => task.isUrgent && !task.isImportant);
    const neither = tasks.filter(task => !task.isUrgent && !task.isImportant);

    return (
      <View id="eColumn" styleSheet={styleSheet}>
        <View id="eRow">
          <View id="taskGroup" style={`background-color: #ff5e4b; margin-top: 0px; margin-right: 2px; margin-bottom: 3px;`}>
            {urgentImportant.map(task => (
              <View id="singleTask" key={task._id}>
                <Text>{task.title}</Text>
              </View>
            ))}
          </View>
          <View id="taskGroup" style={`background-color: #83a598; margin-top: 0px; margin-left: 2px; margin-bottom: 3px;`}>
            {notUrgentImportant.map(task => (
              <View id="singleTask" key={task._id}>
                <Text>{task.title}</Text>
              </View>
            ))}
          </View>
        </View>
        <View id="eRow">
          <View id="taskGroup" style={`background-color: #ff9034; margin-top: 3px; margin-right: 2px; margin-bottom: 2px;`}>
            {urgentNotImportant.map(task => (
              <View id="singleTask" key={task._id}>
                <Text>{task.title}</Text>
              </View>
            ))}
          </View>
          <View id="taskGroup" style={`background-color: #a89984; margin-top: 3px; margin-left: 2px; margin-bottom: 2px;`}>
            {neither.map(task => (
              <View id="singleTask" key={task._id}>
                <Text>{task.title}</Text>
              </View>
            ))}
          </View>
        </View>
        <Button id="textButton" style={`margin-top: 2px;`} text="Refresh" on={{clicked: () => this.fetchTasks()}} />
      </View>
    );
  }
}

const styleSheet = `

  #eColumn {
    padding-top: 7px;
    flex-direction: 'column';
  }

  #eRow { 
    flex-direction: 'row';
    flex: 1;
    justify-content: 'space-between';
  }

  #taskGroup {
    flex-direction: 'column';
    flex: 1;
    height: '100%';
    border: 4px;
    padding: 4px;
    margin: 4px;
    border-radius: 3px;
  }

  #singleTask {
    flex-direction: 'row';
    align-items: 'center';
  }

`

export default EisenhowerMatrix;

