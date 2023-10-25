import * as React from 'react';
import { Button, LineEdit, View, Text, CheckBox } from '@nodegui/react-nodegui';
import axios from 'axios';
import SessionContext from '../SessionContext';

interface AddTaskFormState {
  newTaskTitle: string;
  isUrgent: boolean;
  isImportant: boolean;
}

interface AddTaskFormProps {
  onTaskAdded: () => void;  // A function to call when a task is added
}

class AddTaskForm extends React.Component<AddTaskFormProps, AddTaskFormState> {
  
  static contextType = SessionContext;

  constructor(props: AddTaskFormProps) {
    super(props);
    this.state = {
      newTaskTitle: '',
      isUrgent: false,
      isImportant: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUrgentChange = this.handleUrgentChange.bind(this);
    this.handleImportantChange = this.handleImportantChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(newText: string) {
    this.setState({ newTaskTitle: newText });
  }

  handleUrgentChange(checked: boolean) {
    this.setState({ isUrgent: checked });
  }

  handleImportantChange(checked: boolean) {
    this.setState({ isImportant: checked });
  }

  async sendAddTaskRequest(newTaskTitle: string, isUrgent: boolean, isImportant: boolean) {
    try {
      const { website, cookies } = this.context;
      const cookiesString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
      const axiosInstance = axios.create({
        baseURL: `${website}`,
        headers: { 'cookie': cookiesString }
      });
      const response = await axiosInstance.post('/tasks', {
        title: newTaskTitle,
        isUrgent: isUrgent,
        isImportant: isImportant
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add task", error);
      throw error;  // So that it can be caught in the handleSubmit method
    }
  }

  async handleSubmit() {
    try {
      await this.sendAddTaskRequest(this.state.newTaskTitle, this.state.isUrgent, this.state.isImportant);
      console.log('onTaskAdded:', this.props.onTaskAdded);
      this.setState({ newTaskTitle: '' });  // Reset the input field to empty

      if (this.props.onTaskAdded) {
        await this.props.onTaskAdded();
      }
    } catch(error) {
      console.error("Failed to add task", error);
    }
  }

  render() {
    return (
      <View style="flex-direction: 'row'; align-items: 'center';">
        <Button id="iconButton" text="➕" on={{ clicked: this.handleSubmit }} />
        <LineEdit id="lineEdit" text={this.state.newTaskTitle} on={{ textChanged: this.handleInputChange }}/>
        <CheckBox text="Urgent" on={{ toggled: this.handleUrgentChange }} />
        <CheckBox text="Important" on={{ toggled: this.handleImportantChange }} />
      </View>
    );
  }
}

export default AddTaskForm;

