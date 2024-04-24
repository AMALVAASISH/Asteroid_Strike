// console.log("Hi i am making an asteroid game")
// console.log(canvas)
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// console.log(c)

//c.fillRect(100,100,100,100)// the first two arguments for x, y and last two are for shape

c.fillStyle = 'black'
c.fillRect(0,0,canvas.width,canvas.height)

class Player{
    constructor({position, velocity}){
        this.position = position // x,y object
        this.velocity = velocity
        this.rotation = 0
    }
    draw(){
        c.save() // used to create a context of canvas for rotation purposes

//c.rotate() , it rotates the entire canvas by a given radian
// c.fillStyle = 'green'
// c.fillRect(this.position.x,this.position.y,100,100)

        c.translate(this.position.x,this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x,-this.position.y)

        c.beginPath()
        c.arc(this.position.x,this.position.y, 6,0,Math.PI *2 , false)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()


        c.beginPath()
        c.moveTo(this.position.x + 30,this.position.y)
        c.lineTo(this.position.x - 10, this.position.y - 10)
        c.lineTo(this.position.x - 10, this.position.y + 10)
        c.closePath()

        c.strokeStyle = 'white'
        c.stroke()
        c.restore()
        // c.fillStyle = 'black'
        // c.fill()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x *2
        this.position.y += this.velocity.y * 2

    }

    getVertices() {
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)
    
        return [
          {
            x: this.position.x + cos * 30 - sin * 0,
            y: this.position.y + sin * 30 + cos * 0,
          },
          {
            x: this.position.x + cos * -10 - sin * 10,
            y: this.position.y + sin * -10 + cos * 10,
          },
          {
            x: this.position.x + cos * -10 - sin * -10,
            y: this.position.y + sin * -10 + cos * -10,
          },
        ]
      }

}


class Projectile{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5

    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2, false)
        c.closePath()
        c.fillStyle = 'violet'
        c.fill()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
    }

}


class Asteroid{
    constructor({position,velocity,radius}){
        this.position = position
        this.velocity = velocity
        this.radius = radius

    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2, false)
        c.closePath()
        c.strokeStyle = 'white'
        c.stroke()
        c.fillStyle = 'grey'
        c.fill()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}


const player = new Player({
    position: {x:canvas.width / 2,y: canvas.height / 2}, 
    velocity: {x:0,y:0}
})

player.draw()

const keys = {
    ArrowLeft: {
        pressed : false
    },
    ArrowDown:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    },
    Space:{
        pressed: false
    },
    v:{
        pressed: false
    },
    w:{
        pressed: false
    }

}

const projectiles = []

const asteroids = []


const intervalId =  window.setInterval(()=>{
    const index = Math.floor(Math.random() * 4)
    let x,y
    let vx,vy
    let radius = 50 * Math.random() + 10
    switch(index){
        case 0: //left
            x = 0 - radius
            y = Math.random() * canvas.height
            vx = 1
            vy = 0
            break
        case 1: // bottom side of screen
            x = Math.random() * canvas.width
            y = canvas.height + radius
            vx = 0
            vy = -1
            break
        case 2: //right
            x = canvas.width + radius 
            y = Math.random() * canvas.height
            vx = -1
            vy = 0
            break
        case 3: // top
            x = Math.random() * canvas.width
            y = 0 - radius
            vx = 0
            vy = 1
            break
        
    }

    asteroids.push(new Asteroid({
        position: {
        x:x,
        y:y,
    },
        velocity: {
            x:vx,
            y:vy,
        },
        radius,

}))
},3000)


function circleCollision(circle1,circle2){
    const xDifference = circle2.position.x -circle1.position.x
    const yDifferecnce = circle2.position.y - circle1.position.y

    const distance = Math.sqrt(xDifference* xDifference + yDifferecnce * yDifferecnce)
    if (distance <= circle1.radius + circle2.radius){
        return true
    }
    return false
}



function circleTriangleCollision(circle, triangle) {
    // Check if the circle is colliding with any of the triangle's edges
    for (let i = 0; i < 3; i++) {
      let start = triangle[i]
      let end = triangle[(i + 1) % 3]
  
      let dx = end.x - start.x
      let dy = end.y - start.y
      let length = Math.sqrt(dx * dx + dy * dy)
  
      let dot =
        ((circle.position.x - start.x) * dx +
          (circle.position.y - start.y) * dy) /
        Math.pow(length, 2)
  
      let closestX = start.x + dot * dx
      let closestY = start.y + dot * dy
  
      if (!isPointOnLineSegment(closestX, closestY, start, end)) {
        closestX = closestX < start.x ? start.x : end.x
        closestY = closestY < start.y ? start.y : end.y
      }
  
      dx = closestX - circle.position.x
      dy = closestY - circle.position.y
  
      let distance = Math.sqrt(dx * dx + dy * dy)
  
      if (distance <= circle.radius) {
        return true
      }
    }
  
    // No collision
    return false
}
  
  function isPointOnLineSegment(x, y, start, end) {
    return (
      x >= Math.min(start.x, end.x) &&
      x <= Math.max(start.x, end.x) &&
      y >= Math.min(start.y, end.y) &&
      y <= Math.max(start.y, end.y)
    )
  }


let score = 0;

function animate(){
    const animationId = window.requestAnimationFrame(animate)
    console.log('animate')
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)

    player.update()

    for (let i = projectiles.length - 1;i>=0;i--){
        const projectile = projectiles[i]
        projectile.update()

        // grabage collection for projectiles
        if (projectile.position.x  + projectile.radius < 0 || 
            projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile.radius > canvas.height ||
            projectile.position.y + projectile.radius < 0
        ){
            projectiles.splice(i, 1)
        }
    }
    
    
    for (let i = asteroids.length - 1;i>=0;i--){
        const asteroid = asteroids[i]
        asteroid.update()

        if (circleTriangleCollision(asteroid, player.getVertices())) {
            console.log('GAME OVER')
            gameOver();
            window.cancelAnimationFrame(animationId)
            clearInterval(intervalId)
        }

        // grabage collection for projectiles
        if (asteroid.position.x  + asteroid.radius < 0 || 
            asteroid.position.x - asteroid.radius > canvas.width ||
            asteroid.position.y - asteroid.radius > canvas.height ||
            asteroid.position.y + asteroid.radius < 0
        ){
            asteroids.splice(i, 1)
        }

        for (let j = projectiles.length - 1;j>=0;j--){
            const projectile = projectiles[j]

            if (circleCollision(asteroid, projectile)){
                score++
                asteroids.splice(i,1)
                projectiles.splice(j,1)
            }
        }
        
    }


    player.velocity.x = 0.1
    player.velocity.y = 0.1
    if (keys.ArrowRight.pressed) player.velocity.x = 2
    if (keys.ArrowLeft.pressed) player.velocity.x = -2
    if (keys.ArrowUp.pressed) player.velocity.y = -2
    if (keys.ArrowDown.pressed) player.velocity.y = 2

    if (keys.Space.pressed) player.rotation += 0.05
        else if (keys.v.pressed) player.rotation -= 0.05

    if (keys.w.pressed){
        player.velocity.x = Math.cos(player.rotation)
        player.velocity.y = Math.sin(player.rotation)
    } else if (!keys.w.pressed){
        player.rotation.x *= 1
        player.rotation.y *= 1
    }


    c.font = "20px Arial";
    c.fillStyle = "white";
    c.textAlign = "right";
    c.fillText(`Score: ${score}`, canvas.width - 20, 30);
    
}

animate()

window.addEventListener('keydown',(event) => {
    switch(event.code){
        case 'ArrowDown': 
            console.log("down arrow was pressed")
            keys.ArrowDown.pressed = true
            break
        case 'ArrowUp': 
            console.log("up arrow was pressed")
            keys.ArrowUp.pressed = true
            break
        case 'ArrowLeft': 
            console.log("left arrow was pressed")
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight': 
            console.log("right arrow was pressed")
            keys.ArrowRight.pressed = true
            break
        case 'Space':
            keys.Space.pressed = true
            break
        case 'KeyV': 
            keys.v.pressed = true
            break
        case 'KeyW':
            keys.w.pressed =  true
            break
        case 'KeyS':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + Math.cos(player.rotation) * 30 ,
                    y: player.position.y + Math.sin(player.rotation) * 30,
                },
                velocity: {
                    x: Math.cos(player.rotation)*3,
                    y: Math.sin(player.rotation)*3,
                }
            }))
            console.log(projectiles)
            break

    }
    console.log(event)
})


window.addEventListener('keyup',(event) => {
    switch(event.code){
        case 'ArrowDown': 
            console.log("down arrow was pressed")
            keys.ArrowDown.pressed = false
            break
        case 'ArrowUp': 
            console.log("up arrow was pressed")
            keys.ArrowUp.pressed = false
            break
        case 'ArrowLeft': 
            console.log("left arrow was pressed")
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight': 
            console.log("right arrow was pressed")
            keys.ArrowRight.pressed =  false
            break
        case 'Space':
            keys.Space.pressed = false
            break
        case 'KeyV':
            keys.v.pressed = false
            break
        case 'KeyW':
            keys.w.pressed =  false
            break
    }
    console.log(event)
})


function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Show the pop-up window when the page loads
window.onload = function() {
    document.getElementById("popup").style.display = "block";
    // Automatically close the pop-up after 5 seconds
    setTimeout(closePopup, 6000);
};


//======================================================================

// Add a div element for the pop-up window
const popupWindow = document.createElement('div');
popupWindow.classList.add('popup');

// Add message and button to the pop-up window
popupWindow.innerHTML = `
    <div class="popup-content">
        <p>Game Over</p>
        <p>Your score: <span id="score">0</span></p>
        <button id="refreshButton">Restart</button>
    </div>
`;

// Hide the pop-up window initially
popupWindow.style.display = 'none';

// Append the pop-up window to the body
document.body.appendChild(popupWindow);

// Function to refresh the screen
function refreshScreen() {
    window.location.reload();
}

// Show the pop-up window when the game is over
function gameOver() {
    popupWindow.style.display = 'block';
}

// Event listener for the button to refresh the screen
const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', refreshScreen);
