export const InputBox = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full p-2 border border-gray-600 rounded text-black placeholder-gray-400 ${
      props.className || ""
    }`}
  />
);

export const DisabledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    disabled
    {...props}
    className="p-2 border border-gray-600 rounded text-black placeholder-gray-400 cursor-not-allowed"
  />
);
