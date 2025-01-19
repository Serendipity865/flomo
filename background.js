// 初始化side panel
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToFlomo') {
    fetch(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data)
    })
    .then(response => {
      if (response.ok) {
        sendResponse({success: true});
      } else {
        sendResponse({success: false, error: 'API请求失败'});
      }
    })
    .catch(error => {
      sendResponse({success: false, error: error.message});
    });

    // 保持消息通道打开以等待异步响应
    return true;
  }
});
