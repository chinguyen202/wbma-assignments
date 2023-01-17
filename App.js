import {StatusBar} from 'expo-status-bar';
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  ImageBackground,
  Text,
} from 'react-native';
import {Settings} from 'react-native-feather';
import List from './components/List';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#002147"
        networkActivityIndicatorVisible={true}
      />
      <View style={styles.header}>
        <ImageBackground
          source={require('./assets/kitten-background.jpg')}
          style={styles.image}
          imageStyle={{borderBottomRightRadius: 65}}
        ></ImageBackground>
        <Settings
          stroke="white"
          width={35}
          height={35}
          style={styles.icon}
        ></Settings>
        <Text style={styles.text}> Cute Kitten</Text>
      </View>
      <List />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    height: 300,
  },
  image: {
    width: '100%',
    height: 280,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  text: {
    position: 'absolute',
    bottom: 50,
    color: '#c7f9cc',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});
