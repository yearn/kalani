import { AxisBottom } from '@visx/axis'
import { scaleBand } from '@visx/scale'
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedGlyphSeries,
  XYChart,
  Tooltip,
} from '@visx/xychart'
import { useMemo } from 'react'

type Datum = { x: string, y: number }

const example = [
  { x: '2020-01-01', y: 50 },
  { x: '2020-01-02', y: 10 },
  { x: '2020-01-03', y: 20 },
]

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
}

const formatDate = (_date: string) => ''

export default function PricePerShareChart({
  series
}: {
  series?: Datum[]
}) {
  const dateScale = useMemo(() => {
    const first = series?.[0]
    const last = series?.[series.length - 1]
    const sample = (!first || !last) ? [] : [first, last]
    return scaleBand<string>({
      domain: sample.map(accessors.yAccessor),
      padding: 0.2,
    })
  }, [series])

  return <XYChart width={300} height={200} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
    <AnimatedAxis orientation="bottom" />
    <AnimatedGrid columns={false} numTicks={5} />
    <AnimatedGlyphSeries dataKey="Line 1" data={series ?? example} {...accessors} />
    <AxisBottom tickFormat={formatDate} scale={dateScale} />
    <Tooltip
      snapTooltipToDatumX
      snapTooltipToDatumY
      showVerticalCrosshair
      showSeriesGlyphs
      renderTooltip={({ tooltipData, colorScale }) => (
        <div>
          <div style={{ color: colorScale?.(tooltipData?.nearestDatum?.key ?? '') }}>
            {tooltipData?.nearestDatum?.key}
          </div>
          {accessors.xAccessor(tooltipData?.nearestDatum?.datum)}
          {', '}
          {accessors.yAccessor(tooltipData?.nearestDatum?.datum)}
        </div>
      )}
    />
  </XYChart>
}
