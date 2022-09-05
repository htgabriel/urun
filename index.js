import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';

// Register the service
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
