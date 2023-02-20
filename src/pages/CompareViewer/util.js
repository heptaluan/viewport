import cornerstone from 'cornerstone-core'

// 默认工具栏
export const defaultTools = [
  {
    name: 'Wwwc',
    mode: 'active',
    modeOptions: { mouseButtonMask: 2 },
  },
  { name: 'StackScrollMouseWheel', mode: 'active' },
  {
    name: 'RectangleRoi',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Eraser',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Magnify',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'EllipticalRoi',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Angle',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Length',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Pan',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Zoom',
    modeOptions: { mouseButtonMask: 1 },
    configuration: {
      invert: false,
      preventZoomOutsideImage: false,
      minScale: 0.1,
      maxScale: 20.0,
    },
  },
]

// 调整窗宽窗位
export const windowChange = (element, image, index) => {
  /*
   * index = 1，ww: default, wl: default
   * index = 2，ww: 1500, wl: -450
   * index = 3，ww: 250, wl: 30
   * index = 4，ww: 1000, wl: 250
   * index = 5，ww: 300, wl: 40
   */
  const viewportDefault = cornerstone.getDefaultViewportForImage(element, image)
  const viewport = cornerstone.getViewport(element)
  viewport.voiLUT = undefined

  if (index === 1) {
    viewport.voi.windowWidth = viewportDefault.voi.windowWidth
    viewport.voi.windowCenter = viewportDefault.voi.windowCenter
  } else if (index === 2) {
    viewport.voi.windowWidth = 1500
    viewport.voi.windowCenter = -400
  } else if (index === 3) {
    viewport.voi.windowWidth = 250
    viewport.voi.windowCenter = 30
  } else if (index === 4) {
    viewport.voi.windowWidth = 1000
    viewport.voi.windowCenter = 250
  } else if (index === 5) {
    viewport.voi.windowWidth = 300
    viewport.voi.windowCenter = 40
  }

  cornerstone.setViewport(element, viewport)
}

// 缓存图片请求池
export const loadAndCacheImage = (cornerstone, imageList, data) => {
  try {
    const coordZList = []
    for (let i = 0; i < data.length; i++) {
      coordZList.push(data[i].coord.coordZ)
    }

    let filterArr = []
    for (let i = 0; i < coordZList.length; i++) {
      var pre = coordZList[i] - 5 > 0 ? coordZList[i] - 5 : 0
      for (let j = 0; j < 10; j++) {
        filterArr.push(pre + j)
      }
    }

    filterArr = [...new Set(filterArr)]
    const newImageList = []
    for (let i = 0; i < filterArr.length; i++) {
      newImageList.push(imageList[filterArr[i]])
    }

    for (let i = 0; i < newImageList.length; i++) {
      cornerstone.loadAndCacheImage(newImageList[i])
    }
  } catch (error) {
    console.log(error)
  }
  // for (let i = 0; i < imageList.length; i++) {
  //   cornerstone.loadAndCacheImage(imageList[i])
  // }
}
