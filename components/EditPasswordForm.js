import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Button, Card, Input} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EditPasswordForm(props) {
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
      confrimPassword: '',
    },
    mode: 'onBlur',
  });
  const {putUser} = useUser();

  const editPassword = async (editData) => {
    console.log('editing: ', editData);
    delete editData.confrimPassword;
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const editPasswordResult = await putUser(editData, userToken);
      console.log('edit password result: ', editPasswordResult);
    } catch (error) {
      console.error('editPassword', error);
      // TODO: notify user about failed register attempt
    }
  };

  return (
    <>
      <Card>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
              message:
                'Min 5 characters, needs one number, one uppercase letter',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize="none"
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (value === getValues('password')) {
                return true;
              } else {
                return 'password must match';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Re-type password"
              secureTextEntry={true}
              autoCapitalize="none"
              errorMessage={
                errors.confrimPassword && errors.confrimPassword.message
              }
            />
          )}
          name="confrimPassword"
        />
        <Button title="Update password!" onPress={handleSubmit(editPassword)} />
      </Card>
    </>
  );
}

export default EditPasswordForm;
