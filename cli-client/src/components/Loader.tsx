import React from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

export const Loader = () => {
  return (
    <Text>
      <Text color="green">
        <Spinner type="dots" />
      </Text>
      {' Loading'}
    </Text>
  );
}