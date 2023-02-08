const buttons = document.querySelectorAll('.selectors button');
for (const button of buttons) {
  button.addEventListener('click', showHideDiv);
}

const tabbuttons = document.querySelectorAll('.tab-selectors button');
for (const button of tabbuttons) {
  button.addEventListener('click', tabShowHideDiv);
}

function showHideDiv(event) {
    const targetDiv = event.target.dataset.target;
    const divElements = document.querySelectorAll('.functsBtn');
    for (const element of divElements) {
      element.style.display = 'none';
    }
    document.querySelector(targetDiv).style.display = 'block';
    const buttonElements = document.querySelectorAll('.selectors button');
    for (const button of buttonElements) {
      button.classList.remove('button-selected');
    }
    event.target.classList.add('button-selected');
}

function tabShowHideDiv(event) {
    const targetDiv = event.target.dataset.target;
    const divElements = document.querySelectorAll('.tab-functsBtn');
    for (const element of divElements) {
      element.style.display = 'none';
    }
    document.querySelector(targetDiv).style.display = 'block';
    const buttonElements = document.querySelectorAll('.tab-selectors button');
    for (const button of buttonElements) {
      button.classList.remove('button-selected');
    }
    event.target.classList.add('button-selected');
}

function clearChat() {
    document.getElementById('chatBox').innerHTML = ""
}

function selectBot(event) {
    const lst = event.target.classList.value
    const cls = "botSelected"
    if(lst.includes(cls)) {
        event.target.classList.remove(cls);
    } else {
        event.target.classList.add(cls);
    }
}

function selectAll() {
    const list = document.getElementById("botList").querySelectorAll('li')
    list.forEach(e => {
        e.classList.add("botSelected")
    });
}
function selectRemove() {
    const list = document.getElementById("botList").querySelectorAll('li')
    list.forEach(e => {
        e.classList.remove("botSelected")
    });
}

const triggers = document.querySelectorAll('.hpop');
triggers.forEach(function (trigger) {
  trigger.addEventListener('mouseenter', function () {
    const popupId = this.getAttribute('data-popup');
    const popup = document.getElementById(popupId);
    const triggerRect = trigger.getBoundingClientRect();
    popup.style.left = triggerRect.right-100 + 'px';
    popup.style.display = 'block';
  });
  trigger.addEventListener('mouseleave', function () {
    const popupId = this.getAttribute('data-popup');
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
  });
});