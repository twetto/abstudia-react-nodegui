import * as React from 'react';
import axios from 'axios';
import { Button, View, Text } from '@nodegui/react-nodegui';
import { Task } from '../types/Task';
import SessionContext from '../SessionContext';
import AddTaskForm from './AddTaskForm';

interface TaskListState {
  tasks: Task[];
}

interface TaskListProps {
}

class TaskList extends React.Component<TaskListProps, TaskListState> {

  static contextType = SessionContext;

  constructor(props: TaskListProps) {
    super(props);
    this.state = {tasks: []};

    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
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

  async deleteTask(taskId: string) {
    try {
      const { website, cookies } = this.context;
      const cookiesString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
      const response = await axios.delete(`/tasks/${taskId}`, {
        baseURL: website,
        headers: { 'cookie': cookiesString }
      });
      this.fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  }

  render() {
    const { tasks } = this.state;
    return (
      <View id="taskList" styleSheet={styleSheet}>
        {tasks.map(task => (
          <View id="singleTask" key={task._id}>
            <Button id="iconButton" text="❎" on={{clicked: () => this.deleteTask(task._id)}} />
            <Text>{task.title}</Text>
          </View>
        ))}
        <AddTaskForm onTaskAdded={() => this.fetchTasks()} />
        <Button id="textButton" text="Refresh" on={{clicked: () => this.fetchTasks()}} />
      </View>
    );
  }
}

const styleSheet = `

  #taskList {
    padding-top: 10px;
  }
  
  #singleTask {
    flex-direction: 'row';
    align-items: 'center';
  }

`

export default TaskList;

