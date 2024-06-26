import React from "react";

const AppShell = ({
  children,
  title,
  result,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  result: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 text-left border rounded-lg hover:shadow-lg">
      <div className="pb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <h3 className="italic font-light">{description}</h3>
      </div>
      {children}
      <div>Result:</div>
      <div className="flex items-center px-2 py-1 overflow-hidden border rounded-md min-h-10">
        {result}
      </div>
    </div>
  );
};

export default AppShell;
