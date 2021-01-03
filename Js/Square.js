
class spot{

  constructor(x,y){
    this.x = x
    this.y = y
    this.occ = []
  }

}

spot.prototype.draw = function(h, c){
  fill(c)
  rect(this.x*h, this.y*h, h, h)
}
spot.prototype.getColor = function(){
  /* Used to flip the boards color while drawing */
  if(this.x % 2 == 0){
    if (this.y % 2 == 0){
      return color(255)
    }else {
      return color(0,100,0)
    }
  }else {
    if (this.y % 2 == 0){
      return color(0,100,0)
    }else {
      return color(255)
    }
  }
}
//array.shift() REMOVES FIRST ITEM IN ARRAY
spot.prototype.advance = function(p){
  if(this.occ.length > 0){ //Capture
    this.occ[0].alive = false
    this.occ.shift()
  }
  append(this.occ, p)
}
//CLEAR OLD OCC
spot.prototype.clear = function(){
  this.occ.shift()
}
