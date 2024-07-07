import { NextUIProvider } from '@nextui-org/react';

export const NextUIConfig = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};
