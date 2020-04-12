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
//array.shift() REMOVES FIRST ITEM IN ARRAY
spot.prototype.advance = function(p){
  if(this.occ.length > 0){
    this.occ.shift()
  }
  append(this.occ, p)
}
//CLEAR OLD OCC
spot.prototype.clear = function(){
  this.occ.shift()
}
