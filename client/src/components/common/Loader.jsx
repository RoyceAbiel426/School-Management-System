/**
 * Loader Component
 * Reusable loading spinner
 */
const Loader = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  text = null,
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variants = {
    primary: "border-primary-600",
    secondary: "border-secondary-600",
    white: "border-white",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizes[size]} ${variants[variant]} border-4 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
