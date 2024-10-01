// WarehouseHeader.tsx
import React from 'react';
interface HeaderProps {
    title: string; 
}
const WarehouseHeader: React.FC<HeaderProps> = ({ title }) => {
    return (

            <h1>{title}</h1>
    );
};

export default WarehouseHeader;
