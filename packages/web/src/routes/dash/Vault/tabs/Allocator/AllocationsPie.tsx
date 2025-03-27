import PieChart, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie'
import { scaleOrdinal } from '@visx/scale'
import { Group } from '@visx/group'
import { animated, useTransition, to } from '@react-spring/web'
import { useMemo } from 'react'

export type PieData = {
  label: string
  value: number
  color: string
}

export default function AllocationsPie({ data, size, animate, className }: { data: PieData[], size: number, animate: boolean, className?: string }) {
  const width = size
  const height = size
  const margin = { top: 0, right: 0, bottom: 0, left: 0 }

  const palette = scaleOrdinal({
    domain: data.map(d => d.label),
    range: data.map(d => d.color),
  })

  if (width < 10) return undefined

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const donutThickness = 50

  return <svg width={width} height={height} className={className}>
    <Group top={centerY + margin.top} left={centerX + margin.left}>
      <PieChart
        data={data}
        pieValue={(d: PieData) => d.value}
        outerRadius={radius}
        innerRadius={radius - donutThickness}
        cornerRadius={3}
        padAngle={0.005}
      >
        {(pie) => (
          <AnimatedPie<PieData>
            {...pie}
            animate={animate}
            getKey={(arc) => `${arc.data.label}-${arc.data.value}`}
            getColor={(arc) => palette(arc.data.label)}
          />
        )}
      </PieChart>
    </Group>
  </svg>
}

// react-spring transition definitions
type AnimatedStyles = { 
  startAngle: number
  endAngle: number
  opacity: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean
  getKey: (d: PieArcDatum<Datum>) => string
  getColor: (d: PieArcDatum<Datum>) => string
  delay?: number
}

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
}: AnimatedPieProps<Datum>) {

  const transitionsData = useMemo(() => ({
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  }), [animate, getKey])

  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, transitionsData)

  return transitions((props, arc, { key }) => {

    const [centroidX, centroidY] = path.centroid(arc)
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

    return (
      <g key={key}>
        <animated.path
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
        />
        {hasSpaceForLabel && (arc.data as PieData).label === 'idle' && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="#666"
              x={centroidX}
              y={centroidY}
              dy="0.33em"
              fontSize={10}
              textAnchor="middle"
              pointerEvents="none">
              {(arc.data as PieData).label}
            </text>
          </animated.g>
        )}
      </g>
    )
  })
}
