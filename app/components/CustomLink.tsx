import { ReactNode } from "react";
import Link from "next/link";
import { UrlObject } from "url";

interface CustomLinkProps {
  href: string | UrlObject;
  children: ReactNode;
  [key: string]: any; // Para cualquier prop adicional
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  ...props
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
