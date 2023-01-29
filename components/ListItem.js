import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Avatar, Button, ListItem as RNEListItem} from '@rneui/themed';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <RNEListItem bottomDivider>
      <Avatar source={{uri: uploadUrl + item.thumbnails?.w160}} size={70} />
      <RNEListItem.Content>
        <RNEListItem.Title numberOfLines={1}>{item.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1}>
          {item.description}
        </RNEListItem.Subtitle>
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
