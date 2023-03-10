import React from 'react';
import PropTypes from 'prop-types';
import {Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {uploadUrl} from '../utils/variables';
import {Card, Icon, ListItem} from '@rneui/themed';
import EditProfileForm from '../components/EditProfileForm';
import EditPasswordForm from '../components/EditPasswordForm';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user, setUser} = React.useContext(MainContext);
  const {getFilesByTag} = useTag();

  const [avatar, setAvatar] = React.useState('http://placekitten.com/640'); // placekitten... is default if user has no avatar

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  React.useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <ScrollView>
      <Card>
        <Card.Title>Username: {user.username}</Card.Title>
        <Card.Image source={{uri: uploadUrl + avatar}} />
        <ListItem>
          <ListItem.Title>
            <Icon name="email" /> {user.email}
          </ListItem.Title>
        </ListItem>
        <ListItem>
          <ListItem.Title>
            <Icon name="badge" />
            {user.full_name}
          </ListItem.Title>
        </ListItem>
        <Button
          title="Logout!"
          onPress={async () => {
            console.log('Loggin out');
            setUser({});
            setIsLoggedIn(false);
            try {
              await AsyncStorage.clear();
            } catch (error) {
              console.warn('clearing AsyncStorage failed', error);
            }
          }}
        />

        <Button
          title="My Files"
          onPress={() => {
            navigation.navigate('MyFiles');
          }}
        />
      </Card>
      <EditProfileForm />
      <EditPasswordForm />
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
