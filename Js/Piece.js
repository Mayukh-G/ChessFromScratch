
class piece{
  constructor(x,y,type,al){
    this.x = x
    this.y = y
    this.type = type
    this.selected = false
    this.alive = true
    this.alliance = al
    this.Ghost = function(h, possible){
      if(this.alliance){
        fill(255)
      }else {
        fill(0)
      }
      strokeWeight(3);
      stroke(255,200,0);
      rectMode(CENTER)
      switch(this.type){ /*---USE BEGIN SHAPE LATER ON TO MAKE THEM LOOK BETTER */
        case 'p':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 20,20)
          break;
        case 'r':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,30)
          break;
        case 'kn':
          triangle(h*(possible[0] + 1/2)-20, h*(possible[1] + 1/2)+20, h*(possible[0] + 1/2)+20, h*(possible[1] + 1/2)+20, h*(possible[0] + 1/2), h*(possible[1] + 1/2)-20 )
          break;
        case 'b':
          ellipse(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,30)
          break;
        case 'q':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,50)
          break;
        case 'k':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 50,30)
          break;
      }
      strokeWeight(2)
      stroke(0)
      rectMode(CORNER)
    }
  }
}

piece.prototype.show = function(h, mouseover){
  rectMode(CENTER)
  if (this.alliance){
    fill(255)
  }else{
    fill(0)
  }
  if(mouseover || this.selected){
    strokeWeight(3)
    stroke(255,200,0)
  }
  switch(this.type){ /* GHOST PROJECTION NOT TO BE USED OUTSIDE OF CLASS */
    case 'p':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 20,20)
      break;
    case 'r':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 30,30)
      break;
    case 'kn':
      triangle(h*(this.x + 1/2)-20, h*(this.y + 1/2)+20, h*(this.x + 1/2)+20, h*(this.y + 1/2)+20, h*(this.x + 1/2), h*(this.y + 1/2)-20 )
      break;
    case 'b':
      ellipse(h*(this.x + 1/2), h*(this.y + 1/2), 30,30)
      break;
    case 'q':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 30,50)
      break;
    case 'k':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 50,30)
      break;
  }

  rectMode(CORNER)
  strokeWeight(2)
  stroke(0)
}
//ACTUAL MOVE
piece.prototype.change = function(m){
  this.x = m[0]
  this.y = m[1]
}

//ASK FOR MOVE
piece.prototype.request = function(possible){
  requestX = floor(8*mouseX/800)
  requestY = floor(8*mouseY/800)
  for(var i = 0; i<possible.length; i++){
    if(possible[i][0] == requestX && possible[i][1] == requestY){
      this.Ghost(800/8, [requestX, requestY])
      return [requestX, requestY]
    }
  }
  return -1
}
//TEST if mouse Over
piece.prototype.over = function(h){
  if(mouseX > this.x*h && mouseX < this.x*h + h){
    if(mouseY > this.y*h && mouseY < this.y*h + h){
      return true
    }
  }
  return false
}
//------ TEST POSSIBLE movement spots
//------------THIS SHOULD BE THE LAST FUNCTION ----------//
piece.prototype.fMove = function(board){

  switch(this.type){
    case 'p':
    var possible = []
    var blocked = false
      if(this.alliance){ //WHITE
        if(this.y-1 >= 0){
          if(board[this.x][this.y-1].occ.length > 0){
            blocked = true
          }
          if (!blocked){
            append(possible, [this.x, this.y-1])
            if(this.y == 6){
              if(board[this.x][this.y-2].occ.length > 0){
                blocked = true
              }
              if (!blocked){
                append(possible, [this.x, this.y-2])
              }
            }
          }//CAPTURE
          if(this.x+1 <= 7){
            if(board[this.x+1][this.y-1].occ.length > 0 && !board[this.x+1][this.y-1].occ[0].alliance){
              append(possible, [this.x+1, this.y-1, true])
            }
          }
          if(this.x-1 >= 0){
            if (board[this.x-1][this.y-1].occ.length > 0 && !board[this.x-1][this.y-1].occ[0].alliance) {
              append(possible, [this.x-1, this.y-1, true])
            }
          }
        }//TOP CHECK
      }
      else if (!this.alliance) { //BLACK
        if(this.y+1 <= 7){
          if(board[this.x][this.y+1].occ.length > 0){
            blocked = true
          }
          if (!blocked){
            append(possible, [this.x, this.y+1])
            if(this.y == 1){
              if(board[this.x][this.y+2].occ.length > 0){
                blocked = true
              }
              if (!blocked){
                append(possible, [this.x, this.y+2])
              }
            }
          }//CAPTURE
          if(this.x+1 <= 7){
            if(board[this.x+1][this.y+1].occ.length > 0 && board[this.x+1][this.y+1].occ[0].alliance){
              append(possible, [this.x+1, this.y+1, true])
            }
          }
          if(this.x-1 >= 0){
            if (board[this.x-1][this.y+1].occ.length > 0 && board[this.x-1][this.y+1].occ[0].alliance) {
              append(possible, [this.x-1, this.y+1, true])
            }
          }
        }
      }
      return (possible)
      break;

    case 'r':
      var possible = []
      var blocked = false
      //Forward in x = this.x
      for(var i = 1; i<this.x+1 && !blocked; i++){
        if(board[this.x-i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y])
        }else if(this.alliance != board[this.x-i][this.y].occ[0].alliance){
          append(possible, [this.x-i, this.y, true])
        }
      }
      blocked = false
      //Backwards in x = 7 - this.x
      for(var i = 1; i<7-this.x+1 && !blocked; i++){
        if(board[this.x+i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y])
        }else if(this.alliance != board[this.x+i][this.y].occ[0].alliance){
          append(possible, [this.x+i, this.y, true])
        }
      }
      blocked = false
      //Forward in y = this.y
      for(var i = 1; i<this.y+1 && !blocked; i++){
        if(board[this.x][this.y-i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y-i])
        }else if(this.alliance != board[this.x][this.y-i].occ[0].alliance){
          append(possible, [this.x, this.y-i, true])
        }
      }
      blocked = false
      //Backwards in y = 7 - this.y
      for(var i = 1; i<7-this.y+1 && !blocked; i++){
        if(board[this.x][this.y+i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y+i])
        }else if(this.alliance != board[this.x][this.y+i].occ[0].alliance){
          append(possible, [this.x, this.y+i, true])
        }
      }
      return(possible)

      break;
    case 'kn':
      var possible = []
      var blocked = false
      var xCoord
      var yCoord
      //Forwards right
      xCoord = this.x+1
      yCoord = this.y-2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right Forwards
      xCoord = this.x+2
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-1
      yCoord = this.y-2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-2
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards right
      xCoord = this.x+1
      yCoord = this.y+2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right Backwards
      xCoord = this.x+2
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Left
      xCoord = this.x-1
      yCoord = this.y+2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Left Backwards
      xCoord = this.x-2
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }

      return(possible)

      break;
    case 'b':
      var possible = []
      var blocked = false
      var j = 1
      //Top Right
      for(var i = 1; i<7-this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y-j])
        }else if(this.alliance != board[this.x+i][this.y-j].occ[0].alliance){
          append(possible, [this.x+i, this.y-j, true])
        }
      }
      blocked = false
      //Top Left
      j=1
      for(var i = 1; i<this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y-j])
        }else if(this.alliance != board[this.x-i][this.y-j].occ[0].alliance){
          append(possible, [this.x-i, this.y-j, true])
        }
      }
      blocked = false
      //Bottom Right
      j=1
      for(var i = 1; i<7-this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y+j])
        }else if(this.alliance != board[this.x+i][this.y+j].occ[0].alliance){
          append(possible, [this.x+i, this.y+j, true])
        }
      }
      blocked = false
      //Bottom Left
      j=1
      for(var i = 1; i<this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y+j])
        }else if(this.alliance != board[this.x-i][this.y+j].occ[0].alliance){
          append(possible, [this.x-i, this.y+j, true])
        }
      }
      return(possible)

      break;
    case 'q':
      var possible = []
      var blocked = false
      //---CARDINAL---//
      //Forward in x = this.x
      for(var i = 1; i<this.x+1 && !blocked; i++){
        if(board[this.x-i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y])
        }else if(this.alliance != board[this.x-i][this.y].occ[0].alliance){
          append(possible, [this.x-i, this.y, true])
        }
      }
      blocked = false
      //Backwards in x = 7 - this.x
      for(var i = 1; i<7-this.x+1 && !blocked; i++){
        if(board[this.x+i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y])
        }else if(this.alliance != board[this.x+i][this.y].occ[0].alliance){
          append(possible, [this.x+i, this.y, true])
        }
      }
      blocked = false
      //Forward in y = this.y
      for(var i = 1; i<this.y+1 && !blocked; i++){
        if(board[this.x][this.y-i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y-i])
        }else if(this.alliance != board[this.x][this.y-i].occ[0].alliance){
          append(possible, [this.x, this.y-i, true])
        }
      }
      blocked = false
      //Backwards in y = 7 - this.y
      for(var i = 1; i<7-this.y+1 && !blocked; i++){
        if(board[this.x][this.y+i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y+i])
        }else if(this.alliance != board[this.x][this.y+i].occ[0].alliance){
          append(possible, [this.x, this.y+i, true])
        }
      }
      blocked = false

      //---DIAGONAL---//
      var j = 1
      //Top Right
      for(var i = 1; i<7-this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y-j])
        }else if(this.alliance != board[this.x+i][this.y-j].occ[0].alliance){
          append(possible, [this.x+i, this.y-j, true])
        }
      }
      blocked = false
      //Top Left
      j=1
      for(var i = 1; i<this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y-j])
        }else if(this.alliance != board[this.x-i][this.y-j].occ[0].alliance){
          append(possible, [this.x-i, this.y-j, true])
        }
      }
      blocked = false
      //Bottom Right
      j=1
      for(var i = 1; i<7-this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y+j])
        }else if(this.alliance != board[this.x+i][this.y+j].occ[0].alliance){
          append(possible, [this.x+i, this.y+j, true])
        }
      }
      blocked = false
      //Bottom Left
      j=1
      for(var i = 1; i<this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y+j])
        }else if(this.alliance != board[this.x-i][this.y+j].occ[0].alliance){
          append(possible, [this.x-i, this.y+j, true])
        }
      }

      return(possible)


      break;
    case 'k':
      var possible = []
      var blocked = false
      var xCoord
      var yCoord
      //Forwards right
      xCoord = this.x+1
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards
      xCoord = this.x
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-1
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Left
      xCoord = this.x-1
      yCoord = this.y
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Left
      xCoord = this.x-1
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards
      xCoord = this.x
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Right
      xCoord = this.x+1
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right
      xCoord = this.x+1
      yCoord = this.y
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      return (possible)

      break;
  }
}
=======
class piece{
  constructor(x,y,type,al){
    this.x = x
    this.y = y
    this.type = type
    this.selected = false
    this.alive = true
    this.alliance = al
    this.Ghost = function(h, possible){
      if(this.alliance){
        fill(255)
      }else {
        fill(0)
      }
      strokeWeight(3);
      stroke(255,200,0);
      rectMode(CENTER)
      switch(this.type){ /*---USE BEGIN SHAPE LATER ON TO MAKE THEM LOOK BETTER */
        case 'p':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 20,20)
          break;
        case 'r':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,30)
          break;
        case 'kn':
          triangle(h*(possible[0] + 1/2)-20, h*(possible[1] + 1/2)+20, h*(possible[0] + 1/2)+20, h*(possible[1] + 1/2)+20, h*(possible[0] + 1/2), h*(possible[1] + 1/2)-20 )
          break;
        case 'b':
          ellipse(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,30)
          break;
        case 'q':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 30,50)
          break;
        case 'k':
          rect(h*(possible[0] + 1/2), h*(possible[1] + 1/2), 50,30)
          break;
      }
      strokeWeight(2)
      stroke(0)
      rectMode(CORNER)
    }
  }
}

piece.prototype.show = function(h, mouseover){
  rectMode(CENTER)
  if (this.alliance){
    fill(255)
  }else{
    fill(0)
  }
  if(mouseover || this.selected){
    strokeWeight(3)
    stroke(255,200,0)
  }
  switch(this.type){ /* GHOST PROJECTION NOT TO BE USED OUTSIDE OF CLASS */
    case 'p':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 20,20)
      break;
    case 'r':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 30,30)
      break;
    case 'kn':
      triangle(h*(this.x + 1/2)-20, h*(this.y + 1/2)+20, h*(this.x + 1/2)+20, h*(this.y + 1/2)+20, h*(this.x + 1/2), h*(this.y + 1/2)-20 )
      break;
    case 'b':
      ellipse(h*(this.x + 1/2), h*(this.y + 1/2), 30,30)
      break;
    case 'q':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 30,50)
      break;
    case 'k':
      rect(h*(this.x + 1/2), h*(this.y + 1/2), 50,30)
      break;
  }

  rectMode(CORNER)
  strokeWeight(2)
  stroke(0)
}
//ACTUAL MOVE
piece.prototype.change = function(m){
  this.x = m[0]
  this.y = m[1]
}

//ASK FOR MOVE
piece.prototype.request = function(possible){
  requestX = floor(8*mouseX/800)
  requestY = floor(8*mouseY/800)
  for(var i = 0; i<possible.length; i++){
    if(possible[i][0] == requestX && possible[i][1] == requestY){
      this.Ghost(800/8, [requestX, requestY])
      return [requestX, requestY]
    }
  }
  return -1
}
//TEST if mouse Over
piece.prototype.over = function(h){
  if(mouseX > this.x*h && mouseX < this.x*h + h){
    if(mouseY > this.y*h && mouseY < this.y*h + h){
      return true
    }
  }
  return false
}
//------ TEST POSSIBLE movement spots
//------------THIS SHOULD BE THE LAST FUNCTION ----------//
piece.prototype.fMove = function(board){

  switch(this.type){
    case 'p':
    var possible = []
    var blocked = false
      if(this.alliance){ //WHITE
        if(this.y-1 >= 0){
          if(board[this.x][this.y-1].occ.length > 0){
            blocked = true
          }
          if (!blocked){
            append(possible, [this.x, this.y-1])
            if(this.y == 6){
              if(board[this.x][this.y-2].occ.length > 0){
                blocked = true
              }
              if (!blocked){
                append(possible, [this.x, this.y-2])
              }
            }
          }//CAPTURE
          if(this.x+1 <= 7){
            if(board[this.x+1][this.y-1].occ.length > 0 && !board[this.x+1][this.y-1].occ[0].alliance){
              append(possible, [this.x+1, this.y-1, true])
            }
          }
          if(this.x-1 >= 0){
            if (board[this.x-1][this.y-1].occ.length > 0 && !board[this.x-1][this.y-1].occ[0].alliance) {
              append(possible, [this.x-1, this.y-1, true])
            }
          }
        }//TOP CHECK
      }
      else if (!this.alliance) { //BLACK
        if(this.y+1 <= 7){
          if(board[this.x][this.y+1].occ.length > 0){
            blocked = true
          }
          if (!blocked){
            append(possible, [this.x, this.y+1])
            if(this.y == 1){
              if(board[this.x][this.y+2].occ.length > 0){
                blocked = true
              }
              if (!blocked){
                append(possible, [this.x, this.y+2])
              }
            }
          }//CAPTURE
          if(this.x+1 <= 7){
            if(board[this.x+1][this.y+1].occ.length > 0 && board[this.x+1][this.y+1].occ[0].alliance){
              append(possible, [this.x+1, this.y+1, true])
            }
          }
          if(this.x-1 >= 0){
            if (board[this.x-1][this.y+1].occ.length > 0 && board[this.x-1][this.y+1].occ[0].alliance) {
              append(possible, [this.x-1, this.y+1, true])
            }
          }
        }
      }
      return (possible)
      break;

    case 'r':
      var possible = []
      var blocked = false
      //Forward in x = this.x
      for(var i = 1; i<this.x+1 && !blocked; i++){
        if(board[this.x-i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y])
        }else if(this.alliance != board[this.x-i][this.y].occ[0].alliance){
          append(possible, [this.x-i, this.y, true])
        }
      }
      blocked = false
      //Backwards in x = 7 - this.x
      for(var i = 1; i<7-this.x+1 && !blocked; i++){
        if(board[this.x+i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y])
        }else if(this.alliance != board[this.x+i][this.y].occ[0].alliance){
          append(possible, [this.x+i, this.y, true])
        }
      }
      blocked = false
      //Forward in y = this.y
      for(var i = 1; i<this.y+1 && !blocked; i++){
        if(board[this.x][this.y-i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y-i])
        }else if(this.alliance != board[this.x][this.y-i].occ[0].alliance){
          append(possible, [this.x, this.y-i, true])
        }
      }
      blocked = false
      //Backwards in y = 7 - this.y
      for(var i = 1; i<7-this.y+1 && !blocked; i++){
        if(board[this.x][this.y+i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y+i])
        }else if(this.alliance != board[this.x][this.y+i].occ[0].alliance){
          append(possible, [this.x, this.y+i, true])
        }
      }
      return(possible)

      break;
    case 'kn':
      var possible = []
      var blocked = false
      var xCoord
      var yCoord
      //Forwards right
      xCoord = this.x+1
      yCoord = this.y-2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right Forwards
      xCoord = this.x+2
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-1
      yCoord = this.y-2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-2
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards right
      xCoord = this.x+1
      yCoord = this.y+2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right Backwards
      xCoord = this.x+2
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Left
      xCoord = this.x-1
      yCoord = this.y+2
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Left Backwards
      xCoord = this.x-2
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }

      return(possible)

      break;
    case 'b':
      var possible = []
      var blocked = false
      var j = 1
      //Top Right
      for(var i = 1; i<7-this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y-j])
        }else if(this.alliance != board[this.x+i][this.y-j].occ[0].alliance){
          append(possible, [this.x+i, this.y-j, true])
        }
      }
      blocked = false
      //Top Left
      j=1
      for(var i = 1; i<this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y-j])
        }else if(this.alliance != board[this.x-i][this.y-j].occ[0].alliance){
          append(possible, [this.x-i, this.y-j, true])
        }
      }
      blocked = false
      //Bottom Right
      j=1
      for(var i = 1; i<7-this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y+j])
        }else if(this.alliance != board[this.x+i][this.y+j].occ[0].alliance){
          append(possible, [this.x+i, this.y+j, true])
        }
      }
      blocked = false
      //Bottom Left
      j=1
      for(var i = 1; i<this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y+j])
        }else if(this.alliance != board[this.x-i][this.y+j].occ[0].alliance){
          append(possible, [this.x-i, this.y+j, true])
        }
      }
      return(possible)

      break;
    case 'q':
      var possible = []
      var blocked = false
      //---CARDINAL---//
      //Forward in x = this.x
      for(var i = 1; i<this.x+1 && !blocked; i++){
        if(board[this.x-i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y])
        }else if(this.alliance != board[this.x-i][this.y].occ[0].alliance){
          append(possible, [this.x-i, this.y, true])
        }
      }
      blocked = false
      //Backwards in x = 7 - this.x
      for(var i = 1; i<7-this.x+1 && !blocked; i++){
        if(board[this.x+i][this.y].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y])
        }else if(this.alliance != board[this.x+i][this.y].occ[0].alliance){
          append(possible, [this.x+i, this.y, true])
        }
      }
      blocked = false
      //Forward in y = this.y
      for(var i = 1; i<this.y+1 && !blocked; i++){
        if(board[this.x][this.y-i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y-i])
        }else if(this.alliance != board[this.x][this.y-i].occ[0].alliance){
          append(possible, [this.x, this.y-i, true])
        }
      }
      blocked = false
      //Backwards in y = 7 - this.y
      for(var i = 1; i<7-this.y+1 && !blocked; i++){
        if(board[this.x][this.y+i].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x, this.y+i])
        }else if(this.alliance != board[this.x][this.y+i].occ[0].alliance){
          append(possible, [this.x, this.y+i, true])
        }
      }
      blocked = false

      //---DIAGONAL---//
      var j = 1
      //Top Right
      for(var i = 1; i<7-this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y-j])
        }else if(this.alliance != board[this.x+i][this.y-j].occ[0].alliance){
          append(possible, [this.x+i, this.y-j, true])
        }
      }
      blocked = false
      //Top Left
      j=1
      for(var i = 1; i<this.x+1 && j<this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y-j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y-j])
        }else if(this.alliance != board[this.x-i][this.y-j].occ[0].alliance){
          append(possible, [this.x-i, this.y-j, true])
        }
      }
      blocked = false
      //Bottom Right
      j=1
      for(var i = 1; i<7-this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x+i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x+i, this.y+j])
        }else if(this.alliance != board[this.x+i][this.y+j].occ[0].alliance){
          append(possible, [this.x+i, this.y+j, true])
        }
      }
      blocked = false
      //Bottom Left
      j=1
      for(var i = 1; i<this.x+1 && j<7-this.y+1 && !blocked; j++, i++){
        if(board[this.x-i][this.y+j].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [this.x-i, this.y+j])
        }else if(this.alliance != board[this.x-i][this.y+j].occ[0].alliance){
          append(possible, [this.x-i, this.y+j, true])
        }
      }

      return(possible)


      break;
    case 'k':
      var possible = []
      var blocked = false
      var xCoord
      var yCoord
      //Forwards right
      xCoord = this.x+1
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards
      xCoord = this.x
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Forwards Left
      xCoord = this.x-1
      yCoord = this.y-1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Left
      xCoord = this.x-1
      yCoord = this.y
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Left
      xCoord = this.x-1
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards
      xCoord = this.x
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Backwards Right
      xCoord = this.x+1
      yCoord = this.y+1
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      blocked = false
      //Right
      xCoord = this.x+1
      yCoord = this.y
      if(xCoord >= 0 && xCoord <= 7 && yCoord >= 0 && yCoord <= 7){
        if(board[xCoord][yCoord].occ.length > 0){
          blocked = true
        }
        if(!blocked){
          append(possible, [xCoord, yCoord])
        }else if(this.alliance != board[xCoord][yCoord].occ[0].alliance){
          append(possible, [xCoord, yCoord, true])
        }
      }
      return (possible)

      break;
  }
}
