export function Stack({ className = "", ...props }: any) {
  return <div className={`flex flex-col gap-6 md:gap-8 ${className}`} {...props} />;
}
