import * as React from 'react';
import axios from 'axios';
import { Button, View, Text } from '@nodegui/react-nodegui';
import { Task } from '../types/Task';
import SessionContext from '../SessionContext';
import AddTaskForm from './AddTaskForm';

const FIXED_MAX_TASKS = 10;
const FULLSCREEN_MAX_TASKS = 20;

interface TaskListState {
  tasks: Task[];
  currentPage: number;
  isFullscreen: boolean;
}

interface TaskListProps {
}

class TaskList extends React.Component<TaskListProps, TaskListState> {

  static contextType = SessionContext;

  constructor(props: TaskListProps) {
    super(props);
    this.state = {
      tasks: [],
      currentPage: 1,
      isFullscreen: false
    };

    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
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

  handlePageChange(newPage: number) {
    this.setState({ currentPage: newPage });
  }

  toggleFullScreen() {
    this.setState(prevState => ({ isFullscreen: !prevState.isFullscreen }));
  }

  render() {
    const { tasks, currentPage, isFullscreen } = this.state;
    
    const tasksPerPage = isFullscreen ? FULLSCREEN_MAX_TASKS : FIXED_MAX_TASKS;
    const totalPages = Math.ceil(tasks.length / tasksPerPage);
    const displayedTasks = tasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);
    
    return (
      <View id="taskList" styleSheet={styleSheet}>
        {displayedTasks.map(task => (
          <View id="singleTask" key={task._id}>
            <Button id="iconButton" text="❎" on={{clicked: () => this.deleteTask(task._id)}} />
            <Text>{task.title}</Text>
            <View style={` flex-grow: 1; `}></View>
            <View id="taskProperty">
              <Text>{task.isUrgent ? "🚨" : ""}</Text>
            </View>
            <View id="taskProperty">
              <Text>{task.isImportant ? "⭐" : ""}</Text>
            </View>
          </View>
        ))}
        <View id="pageSetting">
          <Button id="iconButton" text="↕️" on={{clicked: () => this.toggleFullScreen()}} />
          <Button id="iconButton" text="⬅️" enabled={currentPage > 1} on={{clicked: () => this.handlePageChange(currentPage - 1)}} />
          <Text>Page {currentPage} of {totalPages}</Text>
          <Button id="iconButton" text="➡️" enabled={currentPage < totalPages}on={{clicked: () => this.handlePageChange(currentPage + 1)}} />
        </View>
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

  #taskProperty {
    width: 40;
    text-align: 'center';
  }

  #pageSetting {
    flex-direction: 'row';
  }

`

export default TaskList;

