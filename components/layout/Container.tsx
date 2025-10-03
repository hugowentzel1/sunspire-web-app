import * as React from "react";

export default function Container({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto max-w-[1200px] px-4 md:px-6 ${className}`}
      {...props}
    />
  );
}