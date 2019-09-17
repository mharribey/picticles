// DOM ELEMENTS & CANVAS
const imageLoader = document.getElementById('imageLoader')
const loader = document.getElementById('loader')
const input = document.querySelector('.file-input')
const back = document.getElementById('back')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.style.width = '100%'
canvas.style.height = '100%'
canvas.width = window.innerWidth
canvas.height = window.innerHeight
input.style.animation = 'fadeIn 0.5s ease'
input.style.opacity = 1

// SETUP VARIABLES
let particles = []
let points = []
let pixelValues = [{}]
let mouse = {
  x: window.innerWidth,
  y: window.innerHeight
}

// ACTIVE MOUSE REPULSION - switch to true
let repulsion = true
// REPULSION ATTRIBUTES
let strength = 1000
let size = 0.7

// SET THE MIN WHITE VALUE YOU WANT : 0 (black) -> 255 (white)
let white_value = 150

// EVENT LISTENERS
document.addEventListener('mousemove', el => {
  mouse = {
    x: el.pageX,
    y: el.pageY
  }
})
imageLoader.addEventListener('change', handleImage, false)

back.addEventListener('click', () => {
  back.style.animation = 'fade 0.5s ease forwards'
  canvas.style.animation = 'translate 0.5s ease forwards'
  setTimeout(function () {
    back.style.visibility = 'hidden'
    canvas.style.display = 'none'
    window.location.href = ''
  }, 1000)
})
// FUNCTIONS

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function init() {
  reset()
  initParticles()
  draw()
}

function handleImage(e) {
  reset()
  canvas.style.cursor = 'none'

  let reader = new FileReader()
  reader.onload = function (event) {
    let img = new Image()
    img.onload = function () {
      drawImageScaled(img, ctx)
      getPixelValues()
      loader.style.visibility = 'hidden'
      back.style.visibility = 'visible'
    }
    input.style.display = 'none'
    loader.style.visibility = 'visible'

    img.src = event.target.result
  }
  reader.readAsDataURL(e.target.files[0])
}

function getPixelValues() {
  for (let i = 0; i < canvas.width; i += 7) {
    for (let j = 0; j < canvas.height; j += 7) {
      let pixeldata = ctx.getImageData(i, j, 1, 1)
      let average =
        (pixeldata.data[0] + pixeldata.data[1] + pixeldata.data[2]) / 3
      let luminosity =
        0.21 * pixeldata.data[0] +
        0.72 * pixeldata.data[1] +
        0.07 * pixeldata.data[2]

      let col = Math.round(average) //choose white mode between 'luminosity' and 'average'

      pixelValues.push(
        col >= white_value
          ? {
            display: true,
            x: i,
            y: j,
            opacity: (col - white_value) / (255 - white_value) //normalise white_value to 255 between 0 and 1
          }
          : ''
      )
    }
  }
  init()
}

function initParticles() {
  pixelValues.forEach(pixel => {
    if (pixel.display == true) {
      let x = pixel.x
      let y = pixel.y
      let radius = pixel.opacity * 2 + 2
      particles.push(new Particles(radius, x, y, pixel.opacity))
      points.push({ x: x, y: y, ox: x, oy: y })
    }
  })
}

function draw() {
  let dx, dy, dist, angle
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(el => {
    ctx.beginPath()
    el.draw(ctx)
  })

  points.forEach((el, i) => {
    // start repulsion calculation
    dx = el.x - mouse.x
    dy = el.y - mouse.y
    angle = Math.atan2(dy, dx)
    dist = strength / Math.sqrt(dx * dx + dy * dy)
    el.x += Math.cos(angle) * dist
    el.y += Math.sin(angle) * dist
    el.x += (el.ox - el.x) * size
    el.y += (el.oy - el.y) * size
    // end repulsion calculation
    particles[i].x = Math.floor(el.x)
    particles[i].y = Math.floor(el.y)
  })

  strength = strength
  size = size

  if (repulsion == true) {
    requestAnimationFrame(draw)
  }
}

// TOOLS

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function drawImageScaled(img, ctx) {
  var scale = Math.min(canvas.width / img.width, canvas.height / img.height)
  var x = canvas.width / 2 - (img.width / 2) * scale
  var y = canvas.height / 2 - (img.height / 2) * scale
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
}
