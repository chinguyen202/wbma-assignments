import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Card, Icon, ListItem, Text} from '@rneui/themed';
import {ScrollView, StyleSheet} from 'react-native';
import {Video} from 'expo-av';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    media_type: type,
    user_id: userId,
    screenshot,
  } = route.params;
  const ref = React.useRef(null);
  const [owner, setOwner] = useState({});
  const {getUserById} = useUser();

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log(owner);
    setOwner(owner);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <ScrollView>
      <Card>
        <Card.Title h4>{title}</Card.Title>
        <Card.Divider />
        {type === 'image' ? (
          <Card.Image
            source={{uri: uploadUrl + filename}}
            style={styles.image}
          />
        ) : (
          <Video
            ref={ref}
            style={styles.video}
            source={{uri: uploadUrl + filename}}
            useNativeControls
            resizeMode="contain"
            onError={(error) => {
              console.log(error);
            }}
            isLooping
            // usePoster
            // posterSource={{uri: uploadUrl + screenshot}}
          />
        )}

        <Card.Divider />
        {description && (
          <ListItem>
            <Text>{description}</Text>
          </ListItem>
        )}
        <ListItem>
          <Icon name="schedule" />
          <Text>{new Date(timeAdded).toLocaleString('fi-FI')}</Text>
        </ListItem>
        <ListItem>
          <Icon name="person" />
          <Text>{owner.username}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  timeAdded: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  video: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default Single;
