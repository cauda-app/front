import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Box({ children, className, ...rest }: Props) {
  return (
    <div className={`root ${className}`} {...rest}>
      {children}
      <style jsx>{`
        .root {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          box-shadow: 0px 0px 6px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
