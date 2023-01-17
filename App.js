import {StatusBar} from 'expo-status-bar';
import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import List from './components/List';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#FFF"
        networkActivityIndicatorVisible={true}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});
