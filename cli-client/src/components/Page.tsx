import { FC, ReactNode } from "react";
import { Box } from "ink";
import { PageHeader } from "./PageHeader.js";
import { Loader } from "./Loader.js";

interface PageProps {
  title: string;
  isLoading?: boolean;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ title, children, isLoading = false }) => {
  return (
    <Box flexDirection="column">
      <PageHeader text={title} />
      {
        isLoading ? (
          <Loader />
        ) : (
          children
        )
      }
    </Box>
  );
}