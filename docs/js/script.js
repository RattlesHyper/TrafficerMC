/* eslint-disable no-unused-vars */
const ul = document.getElementById('menu')
const links = ul.getElementsByTagName('a')

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function (event) {
    for (let j = 0; j < links.length; j++) {
      links[j].classList.remove('active')
    }
    this.classList.add('active')
  })
}

document.addEventListener('mousemove', (e) => {
  const { clientX: mouseX, clientY: mouseY } = e
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window

  const percentX = mouseX / windowWidth
  const percentY = mouseY / windowHeight

  const moveX = (percentX - 0.5) * 50
  const moveY = (percentY - 0.5) * 50

  const background = document.getElementById('container')
  background.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`
})

fetch('https://api.github.com/repos/RattlesHyper/TrafficerMC/releases')
  .then((response) => response.json())
  .then((data) => {
    let totalDownloadCount = 0
    data.forEach((release) => {
      release.assets.forEach((asset) => {
        totalDownloadCount += asset.download_count
      })
    })
    const downloadTitle = document.getElementById('download-title')
    const count = document.getElementById('downloadcount')
    downloadTitle.className = ''
    count.innerHTML = totalDownloadCount
  })
  .catch((error) => console.error('Error:', error))
