export default function Container({ className = "", ...props }: any) {
  return <div className={`mx-auto max-w-screen-xl px-4 md:px-6 ${className}`} {...props} />;
}
