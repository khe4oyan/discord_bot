function log(text, type = 0) { 
  // 0 - default, 1 - done, 2 - fail, 3 - wait
  const consoleDOM = document.querySelector('.console');
  const logDOM = document.createElement("p");
  logDOM.classList.add('log');

  const types = {
    "0": "default",
    "1": "done",
    "2": "fail",
    "3": "warn",
  };

  logDOM.classList.add(types[type]);

  logDOM.innerText = text;
  consoleDOM.prepend(logDOM);
}

// const appStatuses = {
//   default: "default",
//   fetching: "fetching",
//   botOn: 'botOn',
//   botOff: 'botOff',
// };

// let appStatus;

function addEventLiseners() {
  const enableBtn = document.querySelector('.enableBtn');
  const disableBtn = document.querySelector('.disableBtn');
  const passwordInput = document.querySelector('.password');

  enableBtn.addEventListener("click", (e) => {
    if (passwordInput.value.trim() === '') {
      log("Enter password..", 2);
      return;
    }
    
    enableBtn.setAttribute('disabled', 'true');
    disableBtn.setAttribute('disabled', 'true');

    log("Try to on bot..");

    fetch('/on', {
      method: "POST",
      headers: {
        'Content-Type':"application/json",
      },
      body: JSON.stringify({password: passwordInput.value.trim()})
    })
    .then(r => r.json())
    .then(d => {
      if (d.status === 444) {
        log(d.message, 2);
        enableBtn.removeAttribute('disabled');
        disableBtn.removeAttribute('disabled');
        return;
      }
      if (d.status < 400) {
        botStatusOnDOM();
        log(d.message, 1);
      } else {
        log(d.message, 3);
      }

      enableBtn.removeAttribute('disabled');
      disableBtn.removeAttribute('disabled');
    });
  });

  disableBtn.addEventListener("click", (e) => {
    if (passwordInput.value.trim() === '') {
      log("Enter password..", 2);
      return;
    }

    log("Try to off bot..");
    fetch('/off', {
      method: "POST",
      headers: {
        'Content-Type':"application/json",
      },
      body: JSON.stringify({password: passwordInput.value.trim()})
    })
    .then(r => r.json())
    .then(d => {
      if (d.status === 444) {
        log(d.message, 2);
        enableBtn.removeAttribute('disabled');
        disableBtn.removeAttribute('disabled');
        return;
      }
      if (d.status < 400) {
        botStatusOffDOM();
        log(d.message, 1);
      } else {
        log(d.message, 3);
      }

      enableBtn.removeAttribute('disabled');
      disableBtn.removeAttribute('disabled');
    });
  });
}

function getBotOnlineStatus() {
  log("Fetch bot status");
  fetch("/status")
  .then(r => r.json())
  .then(d => {
    if (d.status === 200) {
      botStatusOnDOM();
      log(d.message, 1);
    } else {
      botStatusOffDOM();
      log(d.message, 2);
    }
  });
}

function botStatusOnDOM() {
  document.querySelector(".status").classList.add('enable');
  document.querySelector(".status").classList.remove('disable');
}
function botStatusOffDOM() {
  document.querySelector(".status").classList.add('disable');
  document.querySelector(".status").classList.remove('enable');
}

getBotOnlineStatus();
addEventLiseners();