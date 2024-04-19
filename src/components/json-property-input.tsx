import get from 'lodash.get';
import { useCallback, useId, useMemo } from 'react';
import { isObject } from '../lib/util';

type JsonPropertyInputProps = {
  json: unknown;
  property: string;
  handlePropertyChange: (newValue: string) => void;
};

/**
 * This component handles input of the JSON property path and displays the corresponding value
 */

export default function JsonPropertyInput({
  json,
  property,
  handlePropertyChange,
}: JsonPropertyInputProps): JSX.Element {
  const id = useId();

  const currentPropertyValue = useMemo(() => {
    // pass { res: json } so that the object can be targeted using `res`
    return get({ res: json }, property);
  }, [json, property]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handlePropertyChange(e.target.value);
    },
    [handlePropertyChange]
  );

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-500">
        Property
      </label>
      <input
        id={id}
        className="bg-white max-w-sm border border-gray-400 px-3 py-3 text-xs rounded font-mono"
        onChange={onInputChange}
        type="text"
        value={property}
      />
      <span data-testid="input__property-value" className="font-mono text-xs text-gray-500">
        {isObject(currentPropertyValue) ? (
          <>
            {Array.isArray(currentPropertyValue)
              ? `Array(${currentPropertyValue.length})`
              : 'Object'}
          </>
        ) : (
          String(currentPropertyValue)
        )}
      </span>
    </div>
  );
}
