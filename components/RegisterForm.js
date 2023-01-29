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
  });
  const {postUser} = useUser();

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

  return (
    <>
      <Text h3>Registeration Form</Text>
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
          />
        )}
        name="username"
      />
      {errors.username?.type === 'required' && (
        <Text>Username is required!</Text>
      )}
      {errors.username?.type === 'minLength' && (
        <Text>Username min length is 3 characters!</Text>
      )}

      <Controller
        control={control}
        rules={{required: true, minLength: 5}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            secureTextEntry={true}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password (min. 5 chars) is required!</Text>}

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
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
