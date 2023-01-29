import React from 'react';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';
import {Card, ListItem} from '@rneui/themed';
import {StyleSheet} from 'react-native';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: timeAdded} = route.params;
  return (
    <Card>
      <Card.Image source={{uri: uploadUrl + filename}} style={styles.image} />
      <Card.Title h4>{title}</Card.Title>
      <ListItem>
        <ListItem.Content>
          <ListItem.Subtitle style={styles.timeAdded}>
            {timeAdded}
          </ListItem.Subtitle>
          <ListItem.Subtitle>{description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Card>
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
});

export default Single;
