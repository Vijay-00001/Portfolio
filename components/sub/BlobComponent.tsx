import React, { FC, ReactNode } from 'react';

interface NeonTextProps {
   children: ReactNode;
}

const NeonText: FC<NeonTextProps> = ({ children }) => {
   return <div className="neon-text-container">{children}</div>;
};

export default NeonText;
