class Particles {
  constructor(radius, x, y, opacity) {
    this.radius = radius
    this.x = x
    this.y = y
    this.opacity = opacity
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${this.opacity}`
    ctx.fill()
    ctx.restore()
  }
}
