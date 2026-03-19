import Toast from 'react-native-toast-message';

export const showSuccess = (msg: string, description?: string) =>
  Toast.show({
    type: 'success',
    text1: msg,
    text2: description,
  });

export const showError = (msg: string, description?: string) =>
  Toast.show({
    type: 'error',
    text1: msg,
    text2: description,
  });
