import React from 'react';
import * as Icon from 'react-feather';

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;  
}

const Icons: React.FC<IconProps> = ({ name, color, size = 24, style = null, className = '' }) => {
  const IconTag = Icon[name];
  return <IconTag color={color} size={size} style={style} className={className} />;

}

export default Icons;
