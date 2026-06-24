// src/components/ui/field-error.tsx
interface FieldErrorProps {
  errors?: string[];
}

export function FieldError({ errors }: FieldErrorProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <span>⚠</span>
      {errors[0]}
    </p>
  );
}
