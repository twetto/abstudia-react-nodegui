import * as React from 'react';
import { Button, LineEdit, Text, View } from '@nodegui/react-nodegui';
import { EchoMode } from "@nodegui/nodegui";
import axios from 'axios';
import SessionContext from '../SessionContext';

interface SettingsState {
  userId: string;
  password: string;
  website: string;
}

interface SettingsProps {
}

class Settings extends React.Component<SettingsProps, SettingsState> {

  static contextType = SessionContext;

  axiosInstance = axios.create({
    baseURL: 'https://myapp.my.domain',
    withCredentials: true,
  });

  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      userId: '',
      password: '',
      website: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInputChange(name: keyof SettingsState, value: string) {
    this.setState({ [name]: value } as Pick<SettingsState, keyof SettingsState>);
  }

  async handleLogin() {
    try {
      this.axiosInstance.defaults.baseURL = `https://${this.state.website}`;
      const response = await this.axiosInstance.post('/auth/login', {
        username: this.state.userId,
        password: this.state.password,
      });
      const rawCookies = response.headers['set-cookie'];
      const cookies: { [key: string]: string } = {};
      if (rawCookies) {
        rawCookies.forEach((cookie: string) => {
          const [name, ...rest] = cookie.split(';');
          const [key, value] = name.split('=');
          cookies[key] = value;
        });
      }
      this.context.setSession(`https://${this.state.website}`, cookies);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View styleSheet={styleSheet}>
        <Text id="sectionTitle">Account</Text>
        <LineEdit
          id="lineEdit"
          placeholderText="User ID"
          on={{ textChanged: (newText) => this.handleInputChange('userId', newText) }}
        />
        <LineEdit
          id="lineEdit"
          placeholderText="Password"
          echoMode={EchoMode.Password}
          on={{ textChanged: (newText) => this.handleInputChange('password', newText) }}
        />
        <Text id="sectionTitle">Website</Text>
        <LineEdit
          id="lineEdit"
          placeholderText="Website"
          on={{ textChanged: (newText) => this.handleInputChange('website', newText) }}
        />
        <Button id="textButton" text="Save" on={{clicked: this.handleLogin }} />
      </View>
    );
  }
}

const styleSheet = `
  #sectionTitle {
   font-weight: bold;
   padding-left: 5px;
   padding-right: 5px;
  }

  #lineEdit {
    background-color: #f8f8f6;
    selection-background-color: #5b8089;
    border: 0px;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 3px;
  }
`

export default Settings;

