var doc = "";

chrome.runtime.onMessage.addListener(request => {
  if (request.action !== "getSource") {
    message.innerText = "Error";
    return;
  }
  doc = new DOMParser().parseFromString(request.source, "text/html");
  showUrls();
});

function showUrls() {
  const recordedTitle = doc.getElementById("bigbluebuttonbn_view_recordings_header");
  if (recordedTitle == null) {
    message.innerText = "Please Go To Recorded Classes Page.";
    list.innerHTML = "";
    return;
  }

  const trElements = doc.querySelectorAll("tr[id^='recording']");
  const bbbPlayerScripts = Array.from(trElements).reverse().map((tr, i) => {
    const meetId = tr.getAttribute("id").substr(13);
    const meetUrl = `https://bb.khuisf.ac.ir/playback/presentation/2.0/playback.html?meetingId=${meetId}`;
    // const meetLongDate = tr.getElementsByClassName("c4")[0].innerText;
    return `<li>python bbb-player.py -d ${meetUrl} -n ${lesson.value.replace(" ", "_")}_Session_${i + 1}</li>`;
  });

  list.innerHTML = bbbPlayerScripts.reverse().join("");
  message.innerText = "";
}


function onWindowLoad() {

  const message = document.querySelector('#message');
  const list = document.querySelector('#list');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function () {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

  document.getElementById('lesson').onkeypress = function(e){
    showUrls();
  }

}

window.onload = onWindowLoad;