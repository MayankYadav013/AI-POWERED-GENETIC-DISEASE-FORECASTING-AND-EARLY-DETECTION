import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PredictorPage from './PredictorPage';
import api from '../services/api';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe('PredictorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<PredictorPage />);
    expect(screen.getByText('Genetic disease risk assessment')).toBeInTheDocument();
    expect(screen.getByLabelText(/Maternal age at birth/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Predict risk/i })).toBeInTheDocument();
  });

  it('populates fields when sample values button is clicked', () => {
    render(<PredictorPage />);
    const sampleBtn = screen.getByRole('button', { name: /Use sample values/i });
    fireEvent.click(sampleBtn);

    const maternalAgeInput = screen.getByLabelText(/Maternal age at birth/i);
    expect(maternalAgeInput.value).toBe('28');
  });

});
