import { FC } from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

interface LoaderProps {
  text?: string;
}

export const Loader: FC<LoaderProps> = ({ text = 'Loading' }) => {
  return (
    <Text>
      <Text color="green">
        <Spinner type="dots" />
      </Text>
      {' ' + text}
    </Text>
  );
}