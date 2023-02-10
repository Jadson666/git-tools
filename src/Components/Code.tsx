import { PropsWithChildren } from 'react';

export const Code = ({ children }: PropsWithChildren) => {
  return <code style={{ padding: 8, borderRadius: '4px', backgroundColor: '#fff3d7' }}>{children}</code>;
};
