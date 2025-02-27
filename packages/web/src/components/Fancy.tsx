export default function Fancy({
  text = '',
  bigTextClassName = 'text-5xl', 
  littleTextClassName = 'text-4xl'
}: { 
  text?: string, 
  bigTextClassName?: string, 
  littleTextClassName?: string 
}) {
  const letters = text.split('')
  return <div className="flex flex-wrap items-end gap-0">
    {letters.map((letter, index) => (
      <div key={index} className={`${letter === letter.toUpperCase() ? bigTextClassName : littleTextClassName} font-fancy`}>
        {letter === ' ' ? '\u00A0' : letter}
      </div>
    ))}
  </div>
}
