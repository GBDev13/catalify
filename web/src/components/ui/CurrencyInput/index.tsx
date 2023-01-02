import React, { ComponentProps, KeyboardEvent, useCallback } from 'react';
import { Input } from '../Input';

type CurrencyInputProps = ComponentProps<typeof Input> & {
  max?: number;
  onValueChange: (value: number) => void;
  value: number;
}

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

export const CurrencyInput  = ({
  max = Number.MAX_SAFE_INTEGER,
  onValueChange,
  value,
  onChange,
  ...props
}: CurrencyInputProps) => {
  const valueAbsTrunc = Math.trunc(Math.abs(value));
  if (value !== valueAbsTrunc || !Number.isFinite(value) || Number.isNaN(value)) {
    throw new Error(`invalid value property`);
  }
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { key, keyCode } = e;
      if (
        (value === 0 && !VALID_FIRST.test(key)) ||
        (value !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }
      const valueString = value.toString();
      let nextValue: number;
      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString: string = value === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
      }
      if (nextValue > max) {
        return;
      }
      onValueChange(nextValue);
    },
    [max, onValueChange, value]
  );

  const handleChange = useCallback(() => {
    // DUMMY TO AVOID REACT WARNING
  }, []);

  const valueDisplay = (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Input
      inputMode="numeric"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={valueDisplay}
      {...props}
    />
  );
};