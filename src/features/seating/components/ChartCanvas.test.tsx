import { render, screen } from '@testing-library/react'
import React from 'react'
import ChartCanvas from './ChartCanvas'
import { useSeatingStore } from '../state/store'

// Ensure store is initialized before render
test('chart renders title', () => {
  render(<ChartCanvas title="My Chart" />)
  expect(screen.getByText('My Chart')).toBeInTheDocument()
})