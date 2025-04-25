// Helper function to render error messages for form fields
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function RenderError(errors: any, fieldName: string) {
  if (errors[fieldName] && typeof errors[fieldName].message === "string") {
    return (
      <p style={{ fontSize: "12px" }} className="text-red-500 mt-1">
        {errors[fieldName].message}
      </p>
    );
  }
  return null;
}
