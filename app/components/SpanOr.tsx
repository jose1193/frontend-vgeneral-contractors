import * as React from "react";
import { useTheme } from "../ui/StyledRoot";
export default function SpanOr() {
  const { darkMode } = useTheme();
  return (
    <div className="relative">
      <span className="block w-full h-px bg-gray-300"></span>
      <p
        className={`inline-block w-fit text-sm  px-2 absolute -top-2 inset-x-0 mx-auto ${
          darkMode ? "bg-[#121212]" : "bg-white"
        }`}
      >
        Or
      </p>
    </div>
  );
}
