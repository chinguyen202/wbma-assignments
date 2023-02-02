import {Button, Card, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useCallback, useContext, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';

const Upload = ({navigation}) => {
  const [mediafile, setMediafile] = useState({});
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: {errors},
  } = useForm({defaultValues: {title: '', description: ''}, mode: 'onChange'});

  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setMediafile(result.assets[0]);
        trigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const upload = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);

    const filename = mediafile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediafile.type + '/' + fileExt;

    formData.append('file', {
      uri: mediafile.uri,
      name: filename,
      type: mimeType,
    });

    console.log('form data', formData);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postMedia(formData, token);
      console.log('upload result', result);
      const appTag = {file_id: result.file_id, tag: appId};
      const tagResult = await postTag(appTag, token);
      console.log('tagResult', tagResult);
      Alert.alert('Upload OK', 'File id: ' + result.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('Ok pressed');
            // update the 'update' state in main context
            setUpdate(!update);
            // reset
            reset();
            // TODO: navigate to home
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.log('upload failed: ', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMediafile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetForm();
      };
    }, [])
  );

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Card>
          {mediafile.type === 'video' ? (
            <Card.Title>Video</Card.Title>
          ) : (
            <Card.Image
              source={{
                uri: mediafile.uri || 'http://placekitten.com/1920/1080',
              }}
              onPress={pickFile}
            />
          )}

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Title min length is 3 characters!',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Title"
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: 'Description min length is 5 characters!',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Description"
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />
          <Button
            title="Pick a file"
            onPress={pickFile}
            style={{paddingBottom: 10}}
          />
          <Button
            title="Upload!"
            onPress={handleSubmit(upload)}
            loading={loading}
            disabled={!mediafile.uri || errors.title || errors.description}
          />
          <Button
            title={'Reset'}
            onPress={resetForm}
            type="outline"
            style={{marginTop: 10}}
          />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};
export default Upload;
