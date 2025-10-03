export default function Container({ className = "", ...props }) {
  return <div className={`mx-auto max-w-[1200px] px-4 md:px-6 ${className}`} {...props} />;
}