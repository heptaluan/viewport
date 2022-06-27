import csTools from 'cornerstone-tools'
import toolColors from './toolColors.js'
import {
  getToolState,
  getNewContext,
  draw,
  drawRect,
  getPixelSpacing,
  setShadow,
  drawHandles,
  getROITextBoxCoords,
  calculateSUV,
  numbersWithCommas,
  drawLinkedTextBox,
} from './util'
import { rectangleRoiCursor } from './cursors/index.js'
import toolStyle from './toolStyle'

const BaseAnnotationTool = csTools.importInternal('base/BaseAnnotationTool')

const throttle = (func, wait, options) => {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? Boolean(options.leading) : leading
    trailing = 'trailing' in options ? Boolean(options.trailing) : trailing
  }

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}

const isObject = value => {
  const type = typeof value

  return value !== null && (type === 'object' || type === 'function')
}

const debounce = (func, wait, options) => {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function'

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = Number(wait) || 0
  if (isObject(options)) {
    leading = Boolean(options.leading)
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait
    trailing = 'trailing' in options ? Boolean(options.trailing) : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)

    return result
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      return window.requestAnimationFrame(pendingFunc)
    }

    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    if (useRAF) {
      return window.cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)

    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()

    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined

    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this // eslint-disable-line consistent-this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)

        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }

    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}

export default class MeasureRectTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'MeasureRect',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        drawHandles: true,
        drawHandlesOnHover: false,
        hideHandlesIfMoving: false,
        renderDashed: false,
        handleRadius: 5
      },
      svgCursor: rectangleRoiCursor,
    }

    super(props, defaultProps)

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110)
  }

  createNewMeasurement(eventData) {
    const goodEventData = eventData && eventData.currentPoints && eventData.currentPoints.image

    if (!goodEventData) {
      console.log(`required eventData not supplied to tool ${this.name}'s createNewMeasurement`)
      return
    }

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: false,
        },
        end: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: true,
        },
        initialRotation: eventData.viewport.rotation,
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
        },
      },
    }
  }

  pointNearTool(element, data, coords, interactionType) {
    const hasStartAndEndHandles = data && data.handles && data.handles.start && data.handles.end
    const validParameters = hasStartAndEndHandles

    if (!validParameters) {
      console.log(`invalid parameters supplied to tool ${this.name}'s pointNearTool`)
    }

    if (!validParameters || data.visible === false) {
      return false
    }

    const distance = interactionType === 'mouse' ? 15 : 25
    const startCanvas = window.cornerstone.pixelToCanvas(element, data.handles.start)
    const endCanvas = window.cornerstone.pixelToCanvas(element, data.handles.end)

    const rect = {
      left: Math.min(startCanvas.x, endCanvas.x),
      top: Math.min(startCanvas.y, endCanvas.y),
      width: Math.abs(startCanvas.x - endCanvas.x),
      height: Math.abs(startCanvas.y - endCanvas.y),
    }

    const distanceToPoint = window.cornerstoneMath.rect.distanceToPoint(rect, coords)

    return distanceToPoint < distance
  }

  updateCachedStats(image, element, data) {
    const seriesModule = window.cornerstone.metaData.get('generalSeriesModule', image.imageId) || {}
    const modality = seriesModule.modality
    const pixelSpacing = getPixelSpacing(image)

    const stats = _calculateStats(image, element, data.handles, modality, pixelSpacing)

    data.cachedStats = stats
    data.invalidated = false
  }

  renderToolData(evt) {
    const toolData = getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    const eventData = evt.detail;
    const { image, element } = eventData;
    const lineWidth = toolStyle.getToolWidth();
    // const lineDash = getModule('globalConfiguration').configuration.lineDash;
    const {
      handleRadius,
      drawHandlesOnHover,
      hideHandlesIfMoving,
      renderDashed,
    } = this.configuration;
    const context = getNewContext(eventData.canvasContext.canvas);
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    // Meta
    const seriesModule =
      window.cornerstone.metaData.get('generalSeriesModule', image.imageId) ||
      {};

    // Pixel Spacing
    const modality = seriesModule.modality;
    const hasPixelSpacing = rowPixelSpacing && colPixelSpacing;

    draw(context, context => {
      // If we have tool data for this element - iterate over each set and draw it
      for (let i = 0; i < toolData.data.length; i++) {
        const data = toolData.data[i];

        if (data.visible === false) {
          continue;
        }

        // Configure
        const color = toolColors.getColorIfActive(data);
        const handleOptions = {
          color,
          handleRadius,
          drawHandlesIfActive: drawHandlesOnHover,
          hideHandlesIfMoving,
        };

        setShadow(context, this.configuration);

        const rectOptions = { color };

        if (renderDashed) {
          // rectOptions.lineDash = lineDash;
        }

        // Draw
        drawRect(
          context,
          element,
          data.handles.start,
          data.handles.end,
          rectOptions,
          'pixel',
          data.handles.initialRotation
        );

        if (this.configuration.drawHandles) {
          drawHandles(context, eventData, data.handles, handleOptions);
        }

        // Update textbox stats
        if (data.invalidated === true) {
          if (data.cachedStats) {
            this.throttledUpdateCachedStats(image, element, data);
          } else {
            this.updateCachedStats(image, element, data);
          }
        }

        // Default to textbox on right side of ROI
        if (!data.handles.textBox.hasMoved) {
          const defaultCoords = getROITextBoxCoords(
            eventData.viewport,
            data.handles
          );

          Object.assign(data.handles.textBox, defaultCoords);
        }

        const textBoxAnchorPoints = handles =>
          _findTextBoxAnchorPoints(handles.start, handles.end);
        const textBoxContent = _createTextBoxContent(
          context,
          image.color,
          data.cachedStats,
          modality,
          hasPixelSpacing,
          this.configuration
        );

        data.unit = _getUnit(modality, this.configuration.showHounsfieldUnits);

        drawLinkedTextBox(
          context,
          element,
          data.handles.textBox,
          textBoxContent,
          data.handles,
          textBoxAnchorPoints,
          color,
          lineWidth,
          10,
          true
        );
      }
    });
  }
}

function _getRectangleImageCoordinates(startHandle, endHandle) {
  return {
    left: Math.min(startHandle.x, endHandle.x),
    top: Math.min(startHandle.y, endHandle.y),
    width: Math.abs(startHandle.x - endHandle.x),
    height: Math.abs(startHandle.y - endHandle.y),
  }
}

function _calculateRectangleStats(sp, rectangle) {
  let sum = 0
  let sumSquared = 0
  let count = 0
  let index = 0
  let min = sp ? sp[0] : null
  let max = sp ? sp[0] : null

  for (let y = rectangle.top; y < rectangle.top + rectangle.height; y++) {
    for (let x = rectangle.left; x < rectangle.left + rectangle.width; x++) {
      sum += sp[index]
      sumSquared += sp[index] * sp[index]
      min = Math.min(min, sp[index])
      max = Math.max(max, sp[index])
      count++ // TODO: Wouldn't this just be sp.length?
      index++
    }
  }

  if (count === 0) {
    return {
      count,
      mean: 0.0,
      variance: 0.0,
      stdDev: 0.0,
      min: 0.0,
      max: 0.0,
    }
  }

  const mean = sum / count
  const variance = sumSquared / count - mean * mean

  return {
    count,
    mean,
    variance,
    stdDev: Math.sqrt(variance),
    min,
    max,
  }
}

function _calculateStats(image, element, handles, modality, pixelSpacing) {
  // Retrieve the bounds of the rectangle in image coordinates
  const roiCoordinates = _getRectangleImageCoordinates(handles.start, handles.end)

  // Retrieve the array of pixels that the rectangle bounds cover
  const pixels = window.cornerstone.getPixels(
    element,
    roiCoordinates.left,
    roiCoordinates.top,
    roiCoordinates.width,
    roiCoordinates.height
  )

  // Calculate the mean & standard deviation from the pixels and the rectangle details
  const roiMeanStdDev = _calculateRectangleStats(pixels, roiCoordinates)

  let meanStdDevSUV

  if (modality === 'PT') {
    meanStdDevSUV = {
      mean: calculateSUV(image, roiMeanStdDev.mean, true) || 0,
      stdDev: calculateSUV(image, roiMeanStdDev.stdDev, true) || 0,
    }
  }

  // Calculate the image area from the rectangle dimensions and pixel spacing
  const area =
    roiCoordinates.width *
    (pixelSpacing.colPixelSpacing || 1) *
    (roiCoordinates.height * (pixelSpacing.rowPixelSpacing || 1))

  const perimeter =
    roiCoordinates.width * 2 * (pixelSpacing.colPixelSpacing || 1) +
    roiCoordinates.height * 2 * (pixelSpacing.rowPixelSpacing || 1)

  return {
    area: area || 0,
    perimeter,
    count: roiMeanStdDev.count || 0,
    mean: roiMeanStdDev.mean || 0,
    variance: roiMeanStdDev.variance || 0,
    stdDev: roiMeanStdDev.stdDev || 0,
    min: roiMeanStdDev.min || 0,
    max: roiMeanStdDev.max || 0,
    meanStdDevSUV,
  }
}

function _findTextBoxAnchorPoints(startHandle, endHandle) {
  const { left, top, width, height } = _getRectangleImageCoordinates(startHandle, endHandle)

  return [
    {
      // Top middle point of rectangle
      x: left + width / 2,
      y: top,
    },
    {
      // Left middle point of rectangle
      x: left,
      y: top + height / 2,
    },
    {
      // Bottom middle point of rectangle
      x: left + width / 2,
      y: top + height,
    },
    {
      // Right middle point of rectangle
      x: left + width,
      y: top + height / 2,
    },
  ]
}

function _createTextBoxContent(
  context,
  isColorImage,
  { area, mean, stdDev, min, max, meanStdDevSUV },
  modality,
  hasPixelSpacing,
  options = {}
) {
  const showMinMax = options.showMinMax || false
  const textLines = []

  const otherLines = []

  if (!isColorImage) {
    const hasStandardUptakeValues = meanStdDevSUV && meanStdDevSUV.mean !== 0
    const unit = _getUnit(modality, options.showHounsfieldUnits)

    let meanString = `Mean: ${numbersWithCommas(mean.toFixed(2))} ${unit}`
    const stdDevString = `Std Dev: ${numbersWithCommas(stdDev.toFixed(2))} ${unit}`

    // If this image has SUV values to display, concatenate them to the text line
    if (hasStandardUptakeValues) {
      const SUVtext = ' SUV: '

      const meanSuvString = `${SUVtext}${numbersWithCommas(meanStdDevSUV.mean.toFixed(2))}`
      const stdDevSuvString = `${SUVtext}${numbersWithCommas(meanStdDevSUV.stdDev.toFixed(2))}`

      const targetStringLength = Math.floor(context.measureText(`${stdDevString}     `).width)

      while (context.measureText(meanString).width < targetStringLength) {
        meanString += ' '
      }

      otherLines.push(`${meanString}${meanSuvString}`)
      otherLines.push(`${stdDevString}     ${stdDevSuvString}`)
    } else {
      otherLines.push(`${meanString}`)
      otherLines.push(`${stdDevString}`)
    }

    if (showMinMax) {
      let minString = `Min: ${min} ${unit}`
      const maxString = `Max: ${max} ${unit}`
      const targetStringLength = hasStandardUptakeValues
        ? Math.floor(context.measureText(`${stdDevString}     `).width)
        : Math.floor(context.measureText(`${meanString}     `).width)

      while (context.measureText(minString).width < targetStringLength) {
        minString += ' '
      }

      otherLines.push(`${minString}${maxString}`)
    }
  }

  textLines.push(_formatArea(area, hasPixelSpacing))
  otherLines.forEach(x => textLines.push(x))

  return textLines
}

function _getUnit(modality, showHounsfieldUnits) {
  return modality === 'CT' && showHounsfieldUnits !== false ? 'HU' : ''
}

function _formatArea(area, hasPixelSpacing) {
  // This uses Char code 178 for a superscript 2
  const suffix = hasPixelSpacing ? ` mm${String.fromCharCode(178)}` : ` px${String.fromCharCode(178)}`

  return `Area: ${numbersWithCommas(area.toFixed(2))}${suffix}`
}
