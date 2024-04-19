import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import JsonExplorer from '../src/components/json-explorer';

const demoData = {
  date: '2021-10-27T07:49:14.896Z',
  hasError: false,
  fields: [
    {
      id: '4c212130',
      prop: 'iban',
      value: 'DE81200505501265402568',
      hasError: false,
    },
  ],
};

describe('JsonExplorer', () => {
  it('renders JSON data correctly', () => {
    render(<JsonExplorer json={demoData} />);

    expect(screen.getByText('date:')).toBeInTheDocument();
    expect(screen.getByText("'2021-10-27T07:49:14.896Z',")).toBeInTheDocument();

    expect(screen.getByText('fields:')).toBeInTheDocument();
    expect(screen.getByText('id:')).toBeInTheDocument();
    expect(screen.getByText('prop:')).toBeInTheDocument();
    expect(screen.getByText("'iban',")).toBeInTheDocument();
    expect(screen.getByText('value:')).toBeInTheDocument();
  });

  it('handles edge cases correctly', () => {
    const edgeCaseData = {
      nullValue: null,
      emptyArray: [],
      emptyObject: {},
    };

    render(<JsonExplorer json={edgeCaseData} />);
    expect(screen.getByText('nullValue:')).toBeInTheDocument();
    expect(screen.getByText('null,')).toBeInTheDocument();
    expect(screen.getByText('emptyArray:')).toBeInTheDocument();
    expect(screen.getByText('[')).toBeInTheDocument();
    expect(screen.getByText(']')).toBeInTheDocument();
    expect(screen.getByText('emptyObject:')).toBeInTheDocument();
    expect(screen.getAllByText('{')).toHaveLength(2);
    expect(screen.getAllByText('}')).toHaveLength(2);
  });

  it('updates property input path and value when a key is clicked', () => {
    render(<JsonExplorer json={demoData} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select JSON key date' }));
    expect(screen.getByDisplayValue('res.date')).toBeInTheDocument();
    expect(screen.getByTestId('input__property-value')).toHaveTextContent(
      '2021-10-27T07:49:14.896'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select JSON key id' }));
    expect(screen.getByDisplayValue('res.fields[0].id')).toBeInTheDocument();
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('4c212130');

    fireEvent.click(screen.getByText('prop:'));
    expect(screen.getByDisplayValue('res.fields[0].prop')).toBeInTheDocument();
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('iban');
  });

  it('displays the corresponding value when a property path is entered', () => {
    render(<JsonExplorer json={demoData} />);

    const propertyInput = screen.getByLabelText('Property');
    fireEvent.change(propertyInput, { target: { value: 'res.date' } });
    expect(screen.getByTestId('input__property-value')).toHaveTextContent(
      '2021-10-27T07:49:14.896'
    );

    fireEvent.change(propertyInput, { target: { value: 'res.hasError' } });
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('false');

    fireEvent.change(propertyInput, { target: { value: 'res.fields[0].prop' } });
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('iban');

    fireEvent.change(propertyInput, { target: { value: 'res.fields[0].value' } });
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('DE81200505501265402568');

    fireEvent.change(propertyInput, { target: { value: 'res.nonExistentProperty' } });
    expect(screen.getByTestId('input__property-value')).toHaveTextContent('undefined');
  });
});
