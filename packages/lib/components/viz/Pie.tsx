'use client'

import PieChart, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie'
import { scaleOrdinal } from '@visx/scale'
import { Group } from '@visx/group'
import { animated, useTransition, to } from '@react-spring/web'

export type PieData = {
  label: string
  value: number
}

const scaleValues = (data: PieData[], min: number, max: number): number[] => {
  const values = data.map(item => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  
  return values.map(value => {
    if (minValue === maxValue) return (min + max) / 2
    return min + (value - minValue) * (max - min) / (maxValue - minValue)
  })
}

export default function Pie({ data, size }: { data: PieData[], size: number }) {
  const width = size
  const height = size
  const margin = { top: Math.floor(size / 10), right: Math.floor(size / 10), bottom: Math.floor(size / 10), left: Math.floor(size / 10) }
  const animate = true

  const colorScale = scaleOrdinal({
    domain: data.map(d => d.label),
    range: scaleValues(data, 0.3, 0.6).map(v => `rgba(255,255,255,${v})`),
  })

  if (width < 10) return undefined

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const donutThickness = 50

  return <svg width={width} height={height}>
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
            getColor={(arc) => colorScale(arc.data.label)}
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

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
})

const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean
  getKey: (d: PieArcDatum<Datum>) => string
  getColor: (d: PieArcDatum<Datum>) => string
  onClickDatum?: (d: PieArcDatum<Datum>) => void
  delay?: number
}

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  })
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
          onClick={() => onClickDatum?.(arc)}
          onTouchStart={() => onClickDatum?.(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {arc.data.label}
            </text>
          </animated.g>
        )}
      </g>
    )
  })
}
