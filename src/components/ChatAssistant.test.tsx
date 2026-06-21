import { render, screen } from '@testing-library/react';
import { ChatAssistant } from './ChatAssistant';
import { expect, test } from 'vitest';

test('renders ChatAssistant floating button', () => {
  render(<ChatAssistant />);
  expect(screen.getByRole('button', { name: /Open Eco Assistant Chat/i })).toBeInTheDocument();
});
