const ButtonLink = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-full border border-blue-600 bg-transparent px-5 py-2 text-lg font-normal text-blue-600 transition-all duration-200 hover:scale-[1.03] hover:bg-blue-50 hover:font-semibold active:bg-blue-100 ${className} `}
    >
      {children}
    </a>
  );
};

export default ButtonLink;
