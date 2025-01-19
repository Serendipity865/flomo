// 获取页面元素
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const summaryInput = document.getElementById('summary');
const thoughtsInput = document.getElementById('thoughts');
const submitBtn = document.getElementById('submitBtn');

// 初始化side panel
chrome.sidePanel.setOptions({
  enabled: true
});

// 全局变量，用于存储当前标签页信息
let currentTab;

// 获取并更新当前标签页信息
function updateTabInfo() {
  return new Promise((resolve) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        currentTab = tabs[0]; // 更新当前标签页
        titleInput.value = currentTab.title || '无标题';
        urlInput.value = currentTab.url || '无链接';
        resolve(currentTab);
      }
    });
  });
}

// 在DOM加载完成后获取信息
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.log('Tabs query result:', tabs);
    
    if (tabs.length > 0) {
      currentTab = tabs[0];
      console.log('Current tab:', currentTab);
      
      titleInput.value = currentTab.title || '无标题';
      urlInput.value = currentTab.url || '无链接';
      
      console.log('Title set to:', titleInput.value);
      console.log('URL set to:', urlInput.value);
    } else {
      console.warn('No active tab found');
    }
  });
});

// 监听tab切换事件
chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTab = { id: activeInfo.tabId }; // 更新当前标签页ID
  updateTabInfo(); // 更新当前标签页信息
});

// 提交按钮点击事件
submitBtn.addEventListener('click', async () => {
  // 获取输入内容
  const title = titleInput.value;
  const url = urlInput.value;
  const summary = summaryInput.value;
  const thoughts = thoughtsInput.value;

  // 构建flomo内容
  let content = `【标题】${title}\n【链接】${url}\n\n`;
  
  // 如果感想不为空，则添加感想部分
  if (thoughts && thoughts.trim() !== '') {
    content += `【摘要】${summary}\n【感想】${thoughts}`;
  }
  else{
	content += `${summary}`
  }

  try {
    // 通过background.js调用flomo API
    const response = await chrome.runtime.sendMessage({
      action: 'saveToFlomo',
      url: 'https://flomoapp.com/iwh/MzYxMjI0/19f6582cc4777cd0907988037c6d5541/',
      data: {
        content: content
      }
    });

    if (response.success) {
      alert('保存成功！');
      // 清空输入框
      summaryInput.value = '';
      thoughtsInput.value = '';
    } else {
      throw new Error(response.error || '保存失败，请重试');
    }
  } catch (error) {
    alert(error.message);
  }
});
