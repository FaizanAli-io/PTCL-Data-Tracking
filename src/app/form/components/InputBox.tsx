interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputBox = ({ label, ...props }: InputBoxProps) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full p-2 border border-gray-600 rounded text-black ${props.className || ""}`}
    />
  </div>
);

export const DisabledInput = ({ label, ...props }: InputBoxProps) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      disabled
      {...props}
      className="w-full p-2 border border-gray-600 rounded text-black cursor-not-allowed"
    />
  </div>
);
