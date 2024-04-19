import { useCallback, useState } from 'react';
import { isObject } from '../lib/util';
import JsonKeyButton from './json-key-button';
import JsonPropertyInput from './json-property-input';

type JsonExplorerProps = {
  json: unknown;
};

function renderValue(value: unknown) {
  // objects/arrays themselves are rendered later on, for now just display the opening bracket
  if (Array.isArray(value)) return '[';
  if (isObject(value)) return '{';

  // Format strings with single quotes, add a trailing comma
  return typeof value === 'string' ? `'${value}',` : `${value},`;
}

/**
 * Main component to visualize and explore JSON data
 */

export default function JsonExplorer({ json }: JsonExplorerProps): JSX.Element {
  const [property, setProperty] = useState('');

  // Recursively traverse the json data
  const renderJsonPart = useCallback(
    ({ jsonData, level, path }: { jsonData: unknown; level: number; path?: string }) => {
      const isArray = Array.isArray(jsonData);

      // Base case: directly render non-object data
      if (!isObject(jsonData)) {
        return <span>{JSON.stringify(jsonData)}</span>;
      }

      return (
        <>
          {level === 0 && <span>{isArray ? '[' : '{'}</span>}

          {Object.entries(jsonData).map(([key, value]) => {
            const isValueAnObject = isObject(value);
            const currentPath = path ? (isArray ? path + `[${key}]` : path + `.${key}`) : key;

            return (
              <div key={key} className="pl-5" role="treeitem">
                <div className="flex gap-3">
                  {!isArray && (
                    <>
                      {isValueAnObject ? (
                        <span>{key}:</span>
                      ) : (
                        <JsonKeyButton
                          keyString={key}
                          path={currentPath}
                          handleClick={setProperty}
                        />
                      )}
                    </>
                  )}

                  <div>{renderValue(value)}</div>
                </div>

                {isValueAnObject &&
                  renderJsonPart({
                    jsonData: value,
                    level: level + 1,
                    path: currentPath,
                  })}
              </div>
            );
          })}

          <span>{isArray ? ']' : '}'}</span>
          {level !== 0 && <span>,</span>}
        </>
      );
    },
    [setProperty]
  );

  return (
    <div className="w-full space-y-4">
      <JsonPropertyInput json={json} property={property} handlePropertyChange={setProperty} />

      <div>
        <h3 className="text-sm text-gray-500 mb-1">Response</h3>
        <div
          role="tree"
          className="font-mono w-full text-xs bg-white border border-gray-400 rounded p-2.5 overflow-auto"
        >
          {renderJsonPart({ jsonData: json, level: 0, path: 'res' })}
        </div>
      </div>
    </div>
  );
}
