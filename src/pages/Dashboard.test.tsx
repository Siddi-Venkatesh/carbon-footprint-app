import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { expect, test } from 'vitest';

test('renders No Data fallback if footprint is missing', () => {
  render(
    <BrowserRouter>
      <Dashboard data={null} />
    </BrowserRouter>
  );
  expect(screen.getByText(/No data found/i)).toBeInTheDocument();
});
