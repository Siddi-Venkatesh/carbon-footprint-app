import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Calculator } from './Calculator';
import { expect, test, vi } from 'vitest';

test('renders Calculator form correctly', () => {
  const onComplete = vi.fn();
  render(
    <BrowserRouter>
      <Calculator onComplete={onComplete} />
    </BrowserRouter>
  );
  expect(screen.getByText(/Transport/i)).toBeInTheDocument();
  expect(screen.getByText(/Dietary Preference/i)).toBeInTheDocument();
});
