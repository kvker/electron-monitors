const { app, BrowserWindow, screen } = require('electron')

let mainWindow

app.whenReady().then(() => {
  // 获取所有可用的显示器
  const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()

  if(displays.length > 1) {
    // 计算所有显示器的边界
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    displays.forEach(display => {
      const bounds = display.bounds
      minX = Math.min(minX, bounds.x)
      minY = Math.min(minY, bounds.y)
      maxX = Math.max(maxX, bounds.x + bounds.width)
      maxY = Math.max(maxY, bounds.y + bounds.height)
    })

    // 计算总宽度和高度
    const totalWidth = maxX - minX
    const totalHeight = maxY - minY

    console.log('显示器配置：', {
      minX,
      minY,
      maxX,
      maxY,
      totalWidth,
      totalHeight
    })

    // 创建一个新的浏览器窗口
    mainWindow = new BrowserWindow({
      x: minX,
      y: minY,
      width: totalWidth,
      height: totalHeight,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    // 加载应用的index.html文件
    // mainWindow.loadURL('data:text/html,<h1>Hello, Electron!</h1>')
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // 移除全屏模式，改用自定义窗口大小
    mainWindow.setAlwaysOnTop(true)
    mainWindow.setVisibleOnAllWorkspaces(true)
    
    // 确保窗口在所有显示器上都可见
    mainWindow.setBounds({
      x: minX,
      y: minY,
      width: totalWidth,
      height: totalHeight
    })
  } else {
    console.log("仅检测到一个显示器，无法跨屏展开。")
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})