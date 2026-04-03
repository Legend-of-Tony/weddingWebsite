import { type ReactNode} from 'react'

type FormConditionalProps = {
    render: boolean;
    children: ReactNode;
}

const FormConditional = ({render, children}: FormConditionalProps) => {
  
  

    return (
    <div className={`grid gap-2 ${render ? 'block' : 'hidden'}`}>
        {children}
    </div>
  )
}

export default FormConditional