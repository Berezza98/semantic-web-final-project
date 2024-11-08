import { FC } from 'react';
import { Text } from 'ink';
import chalk from 'chalk';
import figlet from 'figlet';

interface PageHeaderProps {
  text: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ text }) => {
  return (
    <Text>{chalk.yellow(figlet.textSync(text, { horizontalLayout: "full" }))}</Text>
  );
}