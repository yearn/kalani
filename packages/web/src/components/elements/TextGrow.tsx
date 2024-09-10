import { cn } from '../../lib/shadcn'
import { TextAreaClassName } from './TextArea'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type TextGrowProps = TextareaAutosizeProps & {
  className?: string
}

const TextGrow = ({ className, ...props }: TextGrowProps) => {
  return <TextareaAutosize
    {...props}
    rows={1}
    className={cn(TextAreaClassName, className)}
  />
}

TextGrow.displayName = 'TextGrow'

export default TextGrow
