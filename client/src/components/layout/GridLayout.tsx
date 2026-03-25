import type{CSSProperties, ReactNode} from 'react';

type GridLayoutProps = {
    id?: string;
    className?: string;
    children: ReactNode;
    style?: CSSProperties;
};

const GridLayout = ({id, className ='', children, style}: GridLayoutProps) => {
  return (
    <section id={id} className={`grid grid-cols-8 grid-rows-9 gap-4 ${className}`} style={style}>
        {children}
    </section>
  )
}

export default GridLayout