import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Button, Input, Text} from '@rneui/themed';

function RegisterForm(props) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', password: '', email: '', full_name: ''},
    mode: 'onBlur',
  });
  const {postUser, checkUsername} = useUser();

  const register = async (registerData) => {
    console.log('Registering: ', registerData);
    try {
      const registerResult = await postUser(registerData);
      console.log('register result: ', registerResult);
    } catch (error) {
      console.error('Register', error);
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
      <Text h3>Registeration Form</Text>
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
          minLength: 5,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password (min. 5 chars) is required!</Text>}

      <Controller
        control={control}
        rules={{required: {value: true, message: 'This is required.'}}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      {errors.email && <Text>Email is required!</Text>}

      <Controller
        control={control}
        rules={{minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Full name"
            autoCapitalize="words"
          />
        )}
        name="full_name"
      />
      {errors.full_name?.type === 'minLength' && (
        <Text>Full name min length is 3 characters!</Text>
      )}
      <Button title="Register!" onPress={handleSubmit(register)} />
    </>
  );
}

export default RegisterForm;
