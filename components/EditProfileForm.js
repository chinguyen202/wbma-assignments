import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Button, Card, Input} from '@rneui/themed';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EditProfileForm(props) {
  const {user} = React.useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
    },
    mode: 'onBlur',
  });
  const {putUser, checkUsername} = useUser();

  const editProfile = async (editData) => {
    console.log('editing: ', editData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const editResult = await putUser(editData, userToken);
      console.log('edit result: ', editResult);
    } catch (error) {
      console.error('editProfile', error);
      // TODO: notify user about failed register attempt
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  return (
    <>
      <Card>
        <Card.Title>Edit User</Card.Title>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 3,
              message: 'Username min length is 3 characters!',
            },
            validate: checkUser,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              autoCapitalize="none"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value: /^[a-z0-9.]{1,64}@[a-z0-9.-]{2,64}/i,
              message: 'Please enter a valid email!',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              autoCapitalize="none"
              errorMessage={errors.email && errors.email.message}
            />
          )}
          name="email"
        />
        <Button title="Update info!" onPress={handleSubmit(editProfile)} />
      </Card>
    </>
  );
}

export default EditProfileForm;
