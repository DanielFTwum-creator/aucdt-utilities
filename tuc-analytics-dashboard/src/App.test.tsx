import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    // You might want to add more specific assertions here based on your App component's content
    expect(await screen.findByText(/TUC Registration Funnel Analytics/i)).toBeInTheDocument(); // Example: checks for some text in the App
  });
});
