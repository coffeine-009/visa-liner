
chrome.webRequest.onCompleted.addListener(
  function(details) {console.log(details); return {cancel: false};}, 
  {
    urls: [
      "<all_urls>"
    ]
  }, 
  []
)


