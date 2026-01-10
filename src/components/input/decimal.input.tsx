import React, { useState, useEffect, ChangeEvent } from 'react';
import { decimalMask } from '../../utils/mask.util';

interface DecimalInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  precision?: number;
  placeholder?: string;
  name?: string;
}

export const DecimalInput = ({
  label,
  value,
  onChange,
  precision = 2,
  placeholder = '0,00',
  name
}: DecimalInputProps) => {

  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
      setDisplayValue(formatted);
    }
  }, [value, precision]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const inputValue = e.target.value;

    const { formatted, raw } = decimalMask(inputValue, precision);

    setDisplayValue(formatted);

    onChange(raw);
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-xs">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none transition-colors"
      />
    </div>
  );
};