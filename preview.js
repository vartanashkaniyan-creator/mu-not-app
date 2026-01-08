
/**
 * AppBuilder - Preview Module
 * Live preview and simulation of mobile apps
 */

const PreviewManager = (function() {
    'use strict';
    
    // Preview states
    const PreviewState = {
        STOPPED: 'stopped',
        LOADING: 'loading',
        RUNNING: 'running',
        ERROR: 'error'
    };
    
    // Configuration
    const CONFIG = {
        DEVICE_SIZES: {
            iphone: { width: 375, height: 812, name: 'iPhone 13' },
            samsung: { width: 360, height: 740, name: 'Samsung Galaxy' },
            pixel: { width: 393, height: 851, name: 'Google Pixel' },
            ipad: { width: 768, height: 1024, name: 'iPad' },
            custom: { width: 375, height: 667, name: 'Custom' }
        },
        DEFAULT_DEVICE: 'iphone',
        ZOOM_LEVELS: [0.5, 0.75, 1, 1.25, 1.5, 2],
        DEFAULT_ZOOM: 1
    };
    
    // Current state
    let state = {
        status: PreviewState.STOPPED,
        currentApp: null,
        currentDevice: CONFIG.DEFAULT_DEVICE,
        zoomLevel: CONFIG.DEFAULT_ZOOM,
        isFullscreen: false,
        isRotated: false,
        frameRate: 60,
        showFPS: false,
        mockData: {},
        eventListeners: {},
        previewIframe: null,
        intervalId: null
    };
    
    // DOM Elements
    let elements = {
        container: null,
        deviceFrame: null,
        screen: null,
        overlay: null,
        controls: null,
        toolbar: null,
        fpsCounter: null
    };
    
    // Initialize preview system
    function init(containerId = 'preview-container') {
        elements.container = document.getElementById(containerId);
        
        if (!elements.container) {
            console.error(`Preview container not found: #${containerId}`);
            return false;
        }
        
        createPreviewUI();
        setupEventListeners();
        setupDeviceRotation();
        
        console.log('✅ Preview system initialized');
        return true;
    }
    
    // Create preview UI
    function createPreviewUI() {
        // Clear container
        elements.container.innerHTML = '';
        
        // Create device frame
        elements.deviceFrame = document.createElement('div');
        elements.deviceFrame.className = 'device-frame';
        elements.deviceFrame.style.cssText = `
            position: relative;
            width: ${CONFIG.DEVICE_SIZES[state.currentDevice].width}px;
            height: ${CONFIG.DEVICE_SIZES[state.currentDevice].height}px;
            margin: 20px auto;
            border-radius: 40px;
            background: #f0f0f0;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: scale(${state.zoomLevel});
            transform-origin: center top;
        `;
        
        // Create device screen (iframe container)
        elements.screen = document.createElement('div');
        elements.screen.className = 'device-screen';
        elements.screen.style.cssText = `
            position: absolute;
            top: 20px;
            left: 10px;
            right: 10px;
            bottom: 20px;
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        `;
        
        // Create overlay for touch simulation
        elements.overlay = document.createElement('div');
        elements.overlay.className = 'preview-overlay';
        elements.overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
            z-index: 10;
        `;
        
        // Create controls toolbar
        createToolbar();
        
        // Assemble UI
        elements.deviceFrame.appendChild(elements.screen);
        elements.deviceFrame.appendChild(elements.overlay);
        elements.container.appendChild(elements.deviceFrame);
        elements.container.appendChild(elements.controls);
        
        // Create FPS counter
        elements.fpsCounter = document.createElement('div');
        elements.fpsCounter.className = 'fps-counter';
        elements.fpsCounter.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: #0f0;
            font-family: monospace;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            display: none;
            z-index: 1000;
        `;
        elements.fpsCounter.textContent = 'FPS: 60';
        document.body.appendChild(elements.fpsCounter);
    }
    
    // Create controls toolbar
    function createToolbar() {
        elements.controls = document.createElement('div');
        elements.controls.className = 'preview-controls';
        elements.controls.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            flex-wrap: wrap;
        `;
        
        // Device selector
        const deviceSelect = createSelect('device', '📱 دستگاه', 
            Object.entries(CONFIG.DEVICE_SIZES).map(([id, data]) => ({
                value: id,
                label: data.name
            })),
            state.currentDevice,
            (value) => changeDevice(value)
        );
        
        // Zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.style.display = 'flex';
        zoomControls.style.gap = '5px';
        zoomControls.style.alignItems = 'center';
        
        const zoomOutBtn = createButton('➖', 'کوچک‌نمایی', () => changeZoom(-0.25));
        const zoomLabel = document.createElement('span');
        zoomLabel.textContent = `${Math.round(state.zoomLevel * 100)}%`;
        zoomLabel.style.minWidth = '50px';
        zoomLabel.style.textAlign = 'center';
        const zoomInBtn = createButton('➕', 'بزرگ‌نمایی', () => changeZoom(0.25));
        
        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(zoomLabel);
        zoomControls.appendChild(zoomInBtn);
        
        // Rotation button
        const rotateBtn = createButton('🔄', 'چرخش صفحه', () => rotateDevice());
        
        // Fullscreen button
        const fullscreenBtn = createButton('📺', 'حالت تمام‌صفحه', () => toggleFullscreen());
        
        // FPS toggle
        const fpsBtn = createButton('🎮', 'نمایش FPS', () => toggleFPS());
        
        // Refresh button
        const refreshBtn = createButton('🔄', 'بارگذاری مجدد', () => reloadPreview());
        
        // Stop button
        const stopBtn = createButton('⏹️', 'توقف پیش‌نمایش', () => stopPreview());
        
        // Add all controls
        elements.controls.appendChild(deviceSelect);
        elements.controls.appendChild(zoomControls);
        elements.controls.appendChild(rotateBtn);
        elements.controls.appendChild(fullscreenBtn);
        elements.controls.appendChild(fpsBtn);
        elements.controls.appendChild(refreshBtn);
        elements.controls.appendChild(stopBtn);
        
        // Store zoom label for updates
        elements.zoomLabel = zoomLabel;
    }
    
    // Create select element
    function createSelect(id, label, options, value, onChange) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.fontSize = '12px';
        labelEl.htmlFor = id;
        
        const select = document.createElement('select');
        select.id = id;
        select.style.padding = '8px 12px';
        select.style.borderRadius = '5px';
        select.style.border = '1px solid #ddd';
        
        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            if (option.value === value) optionEl.selected = true;
            select.appendChild(optionEl);
        });
        
        select.addEventListener('change', (e) => onChange(e.target.value));
        
        container.appendChild(labelEl);
        container.appendChild(select);
        
        return container;
    }
    
    // Create button element
    function createButton(text, title, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.title = title;
        button.style.cssText = `
            padding: 10px 15px;
            border: none;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        `;
        button.addEventListener('mouseenter', () => {
            button.style.background = '#45a049';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = '#4CAF50';
        });
        button.addEventListener('click', onClick);
        return button;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Touch simulation on overlay
        if (elements.overlay) {
            let touchStart = null;
            
            elements.overlay.addEventListener('touchstart', (e) => {
                touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }, { passive: true });
            
            elements.overlay.addEventListener('touchend', (e) => {
                if (!touchStart) return;
                
                const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
                const deltaX = touchEnd.x - touchStart.x;
                const deltaY = touchEnd.y - touchStart.y;
                
                // Simulate tap or swipe
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    simulateTap(touchEnd);
                } else {
                    simulateSwipe(touchStart, touchEnd);
                }
                
                touchStart = null;
            }, { passive: true });
            
            // Mouse simulation
            elements.overlay.addEventListener('click', (e) => {
                const rect = elements.overlay.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                simulateTap({ x, y });
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!state.currentApp) return;
            
            switch(e.key) {
                case 'Escape':
                    if (state.isFullscreen) toggleFullscreen();
                    break;
                case 'r':
                case 'R':
                    if (e.ctrlKey) reloadPreview();
                    break;
                case 'f':
                case 'F':
                    if (e.ctrlKey) toggleFullscreen();
                    break;
                case 'z':
                case 'Z':
                    if (e.ctrlKey) changeZoom(e.shiftKey ? 0.25 : -0.25);
                    break;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (state.isFullscreen) {
                updateFullscreenSize();
            }
        });
    }
    
    // Setup device rotation simulation
    function setupDeviceRotation() {
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            if (state.currentApp && state.currentApp.supportsRotation) {
                rotateDevice();
            }
        });
        
        // Add gyroscope simulation if available
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                if (state.currentApp && state.currentApp.simulateGyro) {
                    simulateGyroscope(e);
                }
            });
        }
    }
    
    // Load app preview
    async function loadPreview(appId, options = {}) {
        if (state.status === PreviewState.LOADING) {
            console.warn('Preview already loading');
            return false;
        }
        
        try {
            state.status = PreviewState.LOADING;
            state.currentApp = appId;
            
            // Show loading state
            if (elements.screen) {
                elements.screen.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-family: Tahoma, Arial, sans-serif;
                    ">
                        <div style="font-size: 40px; margin-bottom: 20px;">📱</div>
                        <h3>در حال بارگذاری پیش‌نمایش...</h3>
                        <div style="margin-top: 20px; width: 50%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;">
                            <div id="preview-progress" style="width: 0%; height: 100%; background: white; border-radius: 2px; transition: width 0.3s;"></div>
                        </div>
                    </div>
                `;
            }
            
            // Get app data
            const appData = await getAppData(appId);
            if (!appData) {
                throw new Error(`App not found: ${appId}`);
            }
            
            // Create iframe for preview
            createPreviewIframe(appData, options);
            
            // Apply mock data if provided
            if (options.mockData) {
                state.mockData = options.mockData;
                injectMockData();
            }
            
            // Start FPS counter if enabled
            if (state.showFPS) {
                startFPSCounter();
            }
            
            state.status = PreviewState.RUNNING;
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('preview:started', {
                detail: { appId, appData }
            }));
            
            console.log(`✅ Preview started for: ${appId}`);
            return true;
            
        } catch (error) {
            console.error('Failed to load preview:', error);
            showPreviewError(error.message);
            state.status = PreviewState.ERROR;
            return false;
        }
    }
    
    // Get app data from storage or engine
    async function getAppData(appId) {
        // Try storage first
        if (window.AppStorage) {
            const apps = await window.AppStorage.get('user_apps') || [];
            const app = apps.find(a => a.id === appId);
            if (app) return app;
        }
        
        // Try engine default apps
        if (window.AppEngine) {
            const defaultApps = window.AppEngine.getDefaultApps();
            const app = defaultApps.find(a => a.id === appId);
            if (app) return app;
        }
        
        return null;
    }
    
    // Create preview iframe
    function createPreviewIframe(appData, options) {
        // Remove existing iframe
        if (state.previewIframe) {
            state.previewIframe.remove();
        }
        
        // Create new iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'preview-iframe';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: white;
        `;
        
        // Set sandbox permissions
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-modals allow-popups';
        
        // Generate preview HTML
        const previewHTML = generatePreviewHTML(appData, options);
        
        // Write to iframe
        iframe.srcdoc = previewHTML;
        
        // Store reference
        state.previewIframe = iframe;
        
        // Add to screen
        if (elements.screen) {
            // Clear screen and add iframe
            elements.screen.innerHTML = '';
            elements.screen.appendChild(iframe);
            
            // Simulate loading progress
            simulateLoadingProgress();
        }
        
        // Listen for iframe load
        iframe.onload = () => {
            console.log('Preview iframe loaded');
            
            // Inject preview API into iframe
            injectPreviewAPI(iframe.contentWindow);
            
            // Dispatch loaded event
            document.dispatchEvent(new CustomEvent('preview:loaded', {
                detail: { appId: appData.id, iframe }
            }));
        };
        
        iframe.onerror = (error) => {
            console.error('Iframe load error:', error);
            showPreviewError('خطا در بارگذاری پیش‌نمایش');
        };
    }
    
    // Generate preview HTML
    function generatePreviewHTML(appData, options) {
        const isRTL = appData.language === 'fa' || appData.language === 'ar';
        
        return `
            <!DOCTYPE html>
            <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${appData.language || 'fa'}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <title>${appData.name} - Preview</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    body {
                        font-family: ${isRTL ? 'Tahoma, Arial' : 'Arial, sans-serif'};
                        background: ${appData.backgroundColor || '#f5f5f5'};
                        color: ${appData.textColor || '#333'};
                        overflow: hidden;
                        height: 100vh;
                        touch-action: manipulation;
                    }
                    
                    .preview-header {
                        background: ${appData.primaryColor || '#4CAF50'};
                        color: white;
                        padding: 15px;
                        text-align: center;
                        font-weight: bold;
                        position: relative;
                    }
                    
                    .preview-content {
                        height: calc(100vh - 50px);
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        padding: 15px;
                    }
                    
                    .preview-watermark {
                        position: fixed;
                        bottom: 10px;
                        ${isRTL ? 'right' : 'left'}: 10px;
                        opacity: 0.3;
                        font-size: 12px;
                        color: #666;
                    }
                    
                    /* App-specific styles */
                    ${appData.css || ''}
                </style>
            </head>
            <body>
                <div class="preview-header">
                    ${appData.name}
                    <div style="font-size: 12px; opacity: 0.8;">پیش‌نمایش</div>
                </div>
                
                <div class="preview-content" id="app-content">
                    ${appData.template || '<div style="padding: 20px; text-align: center;">محتوای برنامه</div>'}
                </div>
                
                <div class="preview-watermark">
                    AppBuilder Preview
                </div>
                
                <script>
                    // Preview API
                    window.previewAPI = {
                        getAppData: () => ${JSON.stringify(appData)},
                        sendEvent: (type, data) => {
                            window.parent.postMessage({
                                type: 'preview-event',
                                eventType: type,
                                data: data
                            }, '*');
                        },
                        log: (message, data) => {
                            console.log('[Preview]', message, data);
                        }
                    };
                    
                    // App initialization
                    (function() {
                        // Set direction
                        document.dir = "${isRTL ? 'rtl' : 'ltr'}";
                        
                        // Initialize app if script exists
                        ${appData.script || ''}
                        
                        // Send ready event
                        setTimeout(() => {
                            previewAPI.sendEvent('app-ready', { timestamp: Date.now() });
                        }, 100);
                    })();
                </script>
            </body>
            </html>
        `;
    }
    
    // Inject preview API into iframe
    function injectPreviewAPI(iframeWindow) {
        try {
            // Listen for messages from iframe
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'preview-event') {
                    handlePreviewEvent(event.data.eventType, event.data.data);
                }
            });
            
            // Expose mock data
            iframeWindow.mockData = state.mockData;
            
        } catch (error) {
            console.error('Failed to inject preview API:', error);
        }
    }
    
    // Handle events from preview iframe
    function handlePreviewEvent(eventType, data) {
        console.log(`Preview event: ${eventType}`, data);
        
        switch(eventType) {
            case 'app-ready':
                document.dispatchEvent(new CustomEvent('preview:app-ready'));
                break;
                
            case 'button-click':
                simulateHapticFeedback();
                break;
                
            case 'navigation':
                // Handle navigation within preview
                break;
                
            case 'error':
                console.error('Preview app error:', data);
                break;
        }
    }
    
    // Simulate loading progress
    function simulateLoadingProgress() {
        const progressBar = document.getElementById('preview-progress');
        if (!progressBar) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 50);
    }
    
    // Inject mock data into preview
    function injectMockData() {
        if (!state.previewIframe || !state.mockData) return;
        
        try {
            const iframeWindow = state.previewIframe.contentWindow;
            iframeWindow.mockData = state.mockData;
            
            // Dispatch mock data event
            iframeWindow.postMessage({
                type: 'mock-data',
                data: state.mockData
            }, '*');
            
        } catch (error) {
            console.error('Failed to inject mock data:', error);
        }
    }
    
    // Change device type
    function changeDevice(deviceId) {
        if (!CONFIG.DEVICE_SIZES[deviceId]) {
            console.error(`Invalid device: ${deviceId}`);
            return;
        }
        
        state.currentDevice = deviceId;
        const device = CONFIG.DEVICE_SIZES[deviceId];
        
        // Update device frame
        if (elements.deviceFrame) {
            elements.deviceFrame.style.width = `${device.width}px`;
            elements.deviceFrame.style.height = `${device.height}px`;
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preview:device-changed', {
            detail: { device: deviceId, size: device }
        }));
    }
    
    // Change zoom level
    function changeZoom(delta) {
        let newZoom = state.zoomLevel + delta;
        
        // Clamp zoom level
        newZoom = Math.max(0.25, Math.min(3, newZoom));
        
        state.zoomLevel = newZoom;
        
        // Update device frame
        if (elements.deviceFrame) {
            elements.deviceFrame.style.transform = `scale(${newZoom})`;
        }
        
        // Update zoom label
        if (elements.zoomLabel) {
            elements.zoomLabel.textContent = `${Math.round(newZoom * 100)}%`;
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preview:zoom-changed', {
            detail: { zoom: newZoom }
        }));
    }
    
    // Rotate device
    function rotateDevice() {
        state.isRotated = !state.isRotated;
        
        if (elements.deviceFrame) {
            if (state.isRotated) {
                elements.deviceFrame.style.transform = `scale(${state.zoomLevel}) rotate(90deg)`;
                // Swap width and height
                const device = CONFIG.DEVICE_SIZES[state.currentDevice];
                elements.deviceFrame.style.width = `${device.height}px`;
                elements.deviceFrame.style.height = `${device.width}px`;
            } else {
                elements.deviceFrame.style.transform = `scale(${state.zoomLevel})`;
                // Restore original dimensions
                const device = CONFIG.DEVICE_SIZES[state.currentDevice];
                elements.deviceFrame.style.width = `${device.width}px`;
                elements.deviceFrame.style.height = `${device.height}px`;
            }
        }
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preview:rotated', {
            detail: { rotated: state.isRotated }
        }));
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        state.isFullscreen = !state.isFullscreen;
        
        if (state.isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }
    
    // Enter fullscreen mode
    function enterFullscreen() {
        elements.container.style.position = 'fixed';
        elements.container.style.top = '0';
        elements.container.style.left = '0';
        elements.container.style.right = '0';
        elements.container.style.bottom = '0';
        elements.container.style.zIndex = '9999';
        elements.container.style.background = 'rgba(0,0,0,0.9)';
        elements.container.style.display = 'flex';
        elements.container.style.flexDirection = 'column';
        elements.container.style.justifyContent = 'center';
        elements.container.style.alignItems = 'center';
        
        // Hide controls
        elements.controls.style.display = 'none';
        
        // Add exit button
        const exitBtn = createButton('✕', 'خروج از حالت تمام‌صفحه', () => toggleFullscreen());
        exitBtn.style.position = 'absolute';
        exitBtn.style.top = '20px';
        exitBtn.style.right = '20px';
        exitBtn.style.background = 'rgba(255,255,255,0.2)';
        exitBtn.style.zIndex = '10000';
        elements.container.appendChild(exitBtn);
        
        // Store exit button reference
        elements.exitBtn = exitBtn;
    }
    
    // Exit fullscreen mode
    function exitFullscreen() {
        elements.container.style.position = '';
        elements.container.style.top = '';
        elements.container.style.left = '';
        elements.container.style.right = '';
        elements.container.style.bottom = '';
        elements.container.style.zIndex = '';
        elements.container.style.background = '';
        elements.container.style.display = '';
        elements.container.style.flexDirection = '';
        elements.container.style.justifyContent = '';
        elements.container.style.alignItems = '';
        
        // Show controls
        elements.controls.style.display = 'flex';
        
        // Remove exit button
        if (elements.exitBtn) {
            elements.exitBtn.remove();
            elements.exitBtn = null;
        }
    }
    
    // Update fullscreen size
    function updateFullscreenSize() {
        // Adjust zoom for fullscreen
        if (state.isFullscreen && elements.deviceFrame) {
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight - 100; // Account for controls
            
            const device = CONFIG.DEVICE_SIZES[state.currentDevice];
            const scaleX = containerWidth / device.width;
            const scaleY = containerHeight / device.height;
            const scale = Math.min(scaleX, scaleY) * 0.9; // 90% of max scale
            
            elements.deviceFrame.style.transform = `scale(${scale})`;
        }
    }
    
    // Toggle FPS counter
    function toggleFPS() {
        state.showFPS = !state.showFPS;
        
        if (elements.fpsCounter) {
            elements.fpsCounter.style.display = state.showFPS ? 'block' : 'none';
        }
        
        if (state.showFPS) {
            startFPSCounter();
        } else {
            stopFPSCounter();
        }
    }
    
    // Start FPS counter
    function startFPSCounter() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function updateFPS() {
            frameCount++;
            const currentTime = performance.now();
            const delta = currentTime - lastTime;
            
            if (delta >= 1000) {
                const fps = Math.round((frameCount * 1000) / delta);
                state.frameRate = fps;
                
                if (elements.fpsCounter) {
                    elements.fpsCounter.textContent = `FPS: ${fps}`;
                    elements.fpsCounter.style.color = fps >= 50 ? '#0f0' : fps >= 30 ? '#ff0' : '#f00';
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (state.showFPS && state.status === PreviewState.RUNNING) {
                requestAnimationFrame(updateFPS);
            }
        }
        
        updateFPS();
    }
    
    // Stop FPS counter
    function stopFPSCounter() {
        if (elements.fpsCounter) {
            elements.fpsCounter.style.display = 'none';
        }
    }
    
    // Reload preview
    function reloadPreview() {
        if (!state.currentApp || state.status !== PreviewState.RUNNING) return;
        
        const appId = state.currentApp;
        stopPreview();
        
        setTimeout(() => {
            loadPreview(appId, { mockData: state.mockData });
        }, 500);
    }
    
    // Stop preview
    function stopPreview() {
        if (state.previewIframe) {
            state.previewIframe.remove();
            state.previewIframe = null;
        }
        
        if (elements.screen) {
            elements.screen.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    color: #666;
                    font-family: Tahoma, Arial, sans-serif;
                ">
                    <div style="font-size: 40px; margin-bottom: 20px;">📱</div>
                    <h3>پیش‌نمایش متوقف شد</h3>
                    <p style="margin-top: 10px; font-size: 14px;">یک برنامه را برای پیش‌نمایش انتخاب کنید</p>
                </div>
            `;
        }
        
        state.status = PreviewState.STOPPED;
        state.currentApp = null;
        
        // Stop FPS counter
        stopFPSCounter();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preview:stopped'));
    }
    
    // Simulate tap
    function simulateTap(position) {
        if (!state.previewIframe) return;
        
        // Send tap event to iframe
        try {
            state.previewIframe.contentWindow.postMessage({
                type: 'simulate-tap',
                position: position
            }, '*');
        } catch (error) {
            console.error('Failed to simulate tap:', error);
        }
        
        // Visual feedback
        showTapEffect(position);
        
        // Haptic feedback simulation
        simulateHapticFeedback();
    }
    
    // Simulate swipe
    function simulateSwipe(start, end) {
        if (!state.previewIframe) return;
        
        // Send swipe event to iframe
        try {
            state.previewIframe.contentWindow.postMessage({
                type: 'simulate-swipe',
                start: start,
                end: end,
                direction: getSwipeDirection(start, end)
            }, '*');
        } catch (error) {
            console.error('Failed to simulate swipe:', error);
        }
        
        // Visual feedback
        showSwipeEffect(start, end);
    }
    
    // Get swipe direction
    function getSwipeDirection(start, end) {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }
    
    // Show tap visual effect
    function showTapEffect(position) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${position.x - 25}px;
            top: ${position.y - 25}px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 150, 255, 0.3);
            border: 2px solid rgba(0, 150, 255, 0.8);
            pointer-events: none;
            z-index: 100;
            animation: tap-effect 0.5s forwards;
        `;
        
        // Add animation style if not already present
        if (!document.querySelector('#tap-animation')) {
            const style = document.createElement('style');
            style.id = 'tap-animation';
            style.textContent = `
                @keyframes tap-effect {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        elements.overlay.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }
    
    // Show swipe visual effect
    function showSwipeEffect(start, end) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${start.x}px;
            top: ${start.y}px;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: rgba(255, 100, 100, 0.8);
            pointer-events: none;
            z-index: 100;
            animation: swipe-effect 0.3s forwards;
        `;
        
        // Add animation style if not already present
        if (!document.querySelector('#swipe-animation')) {
            const style = document.createElement('style');
            style.id = 'swipe-animation';
            style.textContent = `
                @keyframes swipe-effect {
                    0% { 
                        transform: scale(1);
                        left: ${start.x}px;
                        top: ${start.y}px;
                    }
                    100% { 
                        transform: scale(2);
                        left: ${end.x}px;
                        top: ${end.y}px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        elements.overlay.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }
    
    // Simulate haptic feedback
    function simulateHapticFeedback() {
        // Check if vibration API is available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Visual feedback
        if (elements.deviceFrame) {
            elements.deviceFrame.style.transform = `scale(${state.zoomLevel}) translateX(2px)`;
            setTimeout(() => {
                elements.deviceFrame.style.transform = `scale(${state.zoomLevel})`;
            }, 100);
        }
    }
    
    // Simulate gyroscope
    function simulateGyroscope(event) {
        if (!state.previewIframe) return;
        
        try {
            state.previewIframe.contentWindow.postMessage({
                type: 'simulate-gyro',
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma
            }, '*');
        } catch (error) {
            console.error('Failed to simulate gyro:', error);
        }
    }
    
    // Show preview error
    function showPreviewError(message) {
        if (elements.screen) {
            elements.screen.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    background: #ffebee;
                    color: #c62828;
                    font-family: Tahoma, Arial, sans-serif;
                    padding: 20px;
                    text-align: center;
                ">
                    <div style="font-size: 40px; margin-bottom: 20px;">❌</div>
                    <h3>خطا در پیش‌نمایش</h3>
                    <p style="margin-top: 10px; font-size: 14px;">${message}</p>
                    <button onclick="window.PreviewManager.reloadPreview()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #c62828;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        تلاش مجدد
                    </button>
                </div>
            `;
        }
    }
    
    // Public API
    return {
        // Core methods
        init,
        loadPreview,
        stopPreview,
        reloadPreview,
        
        // Controls
        changeDevice,
        changeZoom,
        rotateDevice,
        toggleFullscreen,
        toggleFPS,
        
        // State
        getState: () => ({ ...state }),
        getConfig: () => ({ ...CONFIG }),
        
        // Simulation
        simulateTap,
        simulateSwipe,
        simulateHapticFeedback,
        
        // Mock data
        setMockData: (data) => {
            state.mockData = data;
            injectMockData();
        },
        
        // Export/Import
        exportPreview: () => {
            return {
                app: state.currentApp,
                device: state.currentDevice,
                zoom: state.zoomLevel,
                rotated: state.isRotated,
                mockData: state.mockData
            };
        },
        
        importPreview: (data) => {
            if (data.app) {
                loadPreview(data.app, {
                    mockData: data.mockData
                });
            }
            
            if (data.device) changeDevice(data.device);
            if (data.zoom) changeZoom(data.zoom - state.zoomLevel);
            if (data.rotated && !state.isRotated) rotateDevice();
        }
    };
})();

// Auto-initialize if container exists
if (typeof window !== 'undefined') {
    window.PreviewManager = PreviewManager;
    
    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('preview-container')) {
                PreviewManager.init();
            }
        });
    } else {
        if (document.getElementById('preview-container')) {
            PreviewManager.init();
        }
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewManager;
}
