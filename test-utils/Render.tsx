import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import React, { ReactNode } from 'react';

// All Mantine components require the MantineProvider parent for testing.
export function render(ui: ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MantineProvider>{children}</MantineProvider>
    ),
  });
}