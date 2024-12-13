import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Cricket Pitch Analyzer heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Cricket Pitch Analyzer/i);
  expect(headingElement).toBeInTheDocument();
});
