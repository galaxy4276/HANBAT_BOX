import React, { DetailsHTMLAttributes, ReactNode } from 'react';
import { Typo } from '@shared/ui';
import clsx from 'clsx';

type Theme = 'primary' | 'white' | 'highlighted-white' | 'outline-red';

type Props = {
  icon?: ReactNode;
  theme?: Theme;
  textSize?: number;
} & DetailsHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  children,
  className,
  theme = 'primary',
  icon,
  textSize = 14,
  ...props
}) => {
  return (
    <button
      className={clsx([
        themeMap[theme],
        className,
        'flex items-center justify-center gap-x-3 whitespace-nowrap',
      ])}
      {...props}
    >
      {icon && icon}
      {typeof children === 'string' && (
        <Typo color={getTypoColor(theme)} size={textSize} bold>
          {children}
        </Typo>
      )}
      {typeof children !== 'string' && children}
    </button>
  );
};

const getTypoColor = (buttonTheme: Theme) => {
  if (buttonTheme === 'outline-red') return 'red';
  return buttonTheme === 'primary' ? 'white' : 'gray';
};

const themeMap: Record<Theme, string> = {
  primary: 'bg-hb-red py-[16px] px-[30px] drop-shadow-sm rounded-[4px]',
  white:
    'bg-white border-[#E5E5E5] py-[16px] px-[30px] border-1 border drop-shadow-sm rounded-[4px]',
  'highlighted-white':
    'bg-white border border-[#585858] border-1 drop-shadow-sm rounded-[4px]',
  'outline-red':
    'bg-white border border-hb-red !text-hb-red border-2 drop-shadow-sm rounded-[4px] py-[4px] px-[9px]',
};