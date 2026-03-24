import type{ReactNode} from 'react';

type GridLayoutProps = {
    id?: string;
    className?: string;
    children: ReactNode;
};

const GridLayout = ({id, className ='', children}: GridLayoutProps) => {
  return (
    <section id={id} className={`grid grid-cols-8 grid-rows-9 gap-4 ${className}`}>
        {children}
    </section>
  )
}

export default GridLayout