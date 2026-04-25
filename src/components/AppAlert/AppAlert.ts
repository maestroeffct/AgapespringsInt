export type AppAlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AppAlertConfig = {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
};

type Handler = (config: AppAlertConfig) => void;

let _handler: Handler = () => {};

export const AppAlert = {
  setHandler(fn: Handler) {
    _handler = fn;
  },

  alert(
    title: string,
    message?: string,
    buttons?: AppAlertButton[],
  ) {
    _handler({ title, message, buttons });
  },
};
