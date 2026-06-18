import { Controller } from "react-hook-form";

export default function CustomInput({
  control,
  name,
  label,
  placeholder,
  type,
}) {
  const id = `input-${name}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="mb-5">
          {label && (
            <label htmlFor={id} className="block mb-2.5 text-gray-800">
              {label}
            </label>
          )}
          <input
            type={type}
            id={id}
            {...field}
            placeholder={placeholder}
            onChange={(e) => {
              if (type === "number") {
                const value = e.target.value;
                field.onChange(value === "" ? "" : Number(value));
              } else {
                field.onChange(e.target.value);
              }
            }}
            className="rounded-lg border border-gray-500 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          {fieldState.error && (
            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}