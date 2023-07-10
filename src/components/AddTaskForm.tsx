import * as React from 'react';
import { Button, LineEdit, View, Text } from '@nodegui/react-nodegui';
import axios from 'axios';

interface AddTaskFormState {
  newTaskTitle: string;
}

interface AddTaskFormProps {
  onTaskAdded: () => void;  // A function to call when a task is added
}

class AddTaskForm extends React.Component<AddTaskFormProps, AddTaskFormState> {
  constructor(props: AddTaskFormProps) {
    super(props);
    this.state = { newTaskTitle: '' };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(newText: string) {
    this.setState({ newTaskTitle: newText });
  }

  async sendAddTaskRequest(newTaskTitle: string) {
    try {
      const response = await axios.post('http://localhost:3000/tasks', { title: newTaskTitle });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add task", error);
      throw error;  // So that it can be caught in the handleSubmit method
    }
  }

  async handleSubmit() {
    try {
      await this.sendAddTaskRequest(this.state.newTaskTitle);
      console.log('onTaskAdded:', this.props.onTaskAdded);
      this.setState({ newTaskTitle: '' });  // Reset the input field to empty

      if (this.props.onTaskAdded) {
        await this.props.onTaskAdded();
      }
    } catch(error) {
      // Handle any errors from the request here
      console.error("Failed to add task", error);
    }
  }

  render() {
    return (
      <View style="flex-direction: 'row'; align-items: 'center';">
        <Button style="margin-left: 5px; margin-right: 5px;" text="➕" on={{ clicked: this.handleSubmit }} />
        <LineEdit text={this.state.newTaskTitle} on={{ textChanged: this.handleInputChange }}/>
      </View>
    );
  }
}

export default AddTaskForm;

