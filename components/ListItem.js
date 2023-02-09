import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {
  Avatar,
  Button,
  ButtonGroup,
  ListItem as RNEListItem,
} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  const {user, setUpdate, update} = useContext(MainContext);
  const {deleteMedia} = useMedia();

  const doDelete = () => {
    try {
      Alert.alert('Delete', 'Delete this file permanently', [
        {text: 'Cancel'},
        {
          text: 'OK',
          onPress: async () => {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(item.file_id, token);
            response && setUpdate(!update);
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RNEListItem bottomDivider>
      <Avatar source={{uri: uploadUrl + item.thumbnails?.w160}} size={70} />
      <RNEListItem.Content>
        <RNEListItem.Title numberOfLines={1}>{item.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1}>
          {item.description}
        </RNEListItem.Subtitle>
        {item.user_id === user.user_id && (
          <ButtonGroup
            buttons={['Modify', 'Delete']}
            rounded
            onPress={(index) => {
              if (index === 0) {
                navigation.navigate('Modify', {file: item});
              } else {
                doDelete();
              }
            }}
          />
        )}
      </RNEListItem.Content>
      <Button
        onPress={() => {
          navigation.navigate('Single', item);
        }}
      >
        View
      </Button>
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
