import { useCallback } from 'react';

type JsonKeyButtonProps = {
  keyString: string;
  handleClick: (path: string) => void;
  path: string;
};

export default function JsonKeyButton({ keyString, handleClick, path }: JsonKeyButtonProps) {
  const onClick = useCallback(() => {
    handleClick(path);
  }, [handleClick, path]);

  return (
    <button
      tabIndex={0}
      aria-label={`Select JSON key ${keyString}`}
      className="text-[#3070cb] hover:underline hover:cursor-pointer appearance-none"
      onClick={onClick}
      type="button"
    >
      {keyString}:
    </button>
  );
}
