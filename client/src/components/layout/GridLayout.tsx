import type{CSSProperties, ReactNode} from 'react';

type GridLayoutProps = {
    id?: string;
    className?: string;
    children: ReactNode;
    style?: CSSProperties;
};

const GridLayout = ({id, className ='', children, style}: GridLayoutProps) => {
  return (
    <section id={id} className={`grid grid-cols-1 lg:grid-cols-8 lg:grid-rows-9 gap-4 min-h-screen lg:h-screen ${className}`} style={style}>
        {children}
    </section>
  )
}

export default GridLayout