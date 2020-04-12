
function flipC(i,j) {
  if(i%2 == 0){
    if (j%2 == 0){
      return color(255)
    }else {
      return color(0,100,0)
    }
  }else {
    if (j%2 == 0){
      return color(0,100,0)
    }else {
      return color(255)
    }
  }
}

let board = []
let allPieces = []
//----Black----FALSE----//
let bPawns = []
let bRooks = [new piece(0,0,'r',false), new piece(7,0,'r',false)]
let bBishops = [new piece(2,0,'b',false), new piece(5,0,'b',false)]
let bKnights = [new piece(1,0,'kn',false), new piece(6,0,'kn',false)]
let bKing = new piece(4,0,'k',false)
let bQueen = new piece(3,0,'q',false)
//----White----TRUE----//
let wPawns = []
let wRooks = [new piece(0,7,'r',true), new piece(7,7,'r',true)]
let wBishops = [new piece(2,7,'b',true), new piece(5,7,'b',true)]
let wKnights = [new piece(1,7,'kn',true), new piece(6,7,'kn',true)]
let wKing = new piece(4,7,'k',true)
let wQueen = new piece(3,7,'q',true)
//----NonGameGlobals----//
let locked = false
let lLocked = false
let selected
let move
//----SETUP STARTS----//
function setup() {
  createCanvas(800, 800);
  //Making 2D array
  for (var i = 0; i < 8; i++){
    board[i] = new Array(8)
  }

  for (var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      board[i][j] = new spot(i,j)
    }
  }
  //PAWNS
  for (var i = 0; i < 8; i++){
    j=1
    append(bPawns, new piece(i,j,'p',false))
    append(board[i][j].occ, bPawns[i])
    append(allPieces, bPawns[i])
  }
  for (var i = 0; i < 8; i++){
    j=6
    append(wPawns, new piece(i,j,'p',true))
    append(board[i][j].occ, wPawns[i])
    append(allPieces, wPawns[i])
  }
  //KINGS
  append(board[4][0].occ, bKing)
  append(allPieces, bKing)
  append(board[4][7].occ, wKing)
  append(allPieces, wKing)

  //QUEENS
  append(board[3][0].occ, bQueen)
  append(allPieces, bQueen)
  append(board[3][7].occ, wQueen)
  append(allPieces, wQueen)

  for (var i=0; i<2; i++){
    //KNIGHTS
    append(board[bKnights[i].x][bKnights[i].y].occ, bKnights[i])
    append(board[wKnights[i].x][wKnights[i].y].occ, wKnights[i])
    append(allPieces, bKnights[i])
    append(allPieces, wKnights[i])
    //ROOKS
    append(board[bRooks[i].x][bRooks[i].y].occ, bRooks[i])
    append(board[wRooks[i].x][wRooks[i].y].occ, wRooks[i])
    append(allPieces, bRooks[i])
    append(allPieces, wRooks[i])
    //BISHOPS
    append(board[bBishops[i].x][bBishops[i].y].occ, bBishops[i])
    append(board[wBishops[i].x][wBishops[i].y].occ, wBishops[i])
    append(allPieces, bBishops[i])
    append(allPieces, wBishops[i])
  }

  console.log(board)
  console.log(allPieces)
}
//MOUSE RELEASED}
function mouseReleased(){
  if(move.length > 1 && selected !== -1){
    console.log("TEST")
    board[move[0]][move[1]].advance(selected)
    board[selected.x][selected.y].clear()
    selected.change(move)
    move = -1
  }
}

//----DRAW STARTS----//
function draw() {
  background(255);
  const h = width/8
  //DRAW BOARD
  for (var i = 0; i < 8; i++){
    for (var j = 0; j < 8; j++){
      board[i][j].draw(h, flipC(i,j))
    }
  }
  //SHOW ALL PIECES
  for (var i = 0; i < allPieces.length; i++){
    if(mouseIsPressed){
      if(allPieces[i].over(h) && !lLocked){
        allPieces[i].selected = true
        lLocked = true
      }
    }else {
      allPieces[i].selected = false
      lLocked = false
    }
    if(lLocked){
      allPieces[i].show(h, false)
    }else {
      allPieces[i].show(h, allPieces[i].over(h))
    }
  }

  //------MOUSE ACTIONS------//
  if(mouseIsPressed){
    for(var i = 0; i < allPieces.length && !locked; i++){
      if(allPieces[i].over(h)){
        selected = allPieces[i]
        locked = true
      }
    }
    if(selected !== -1){
      var options = selected.fMove(h, board)
      for(var j = 0; j<options.length; j++){
        board[options[j][0]][options[j][1]].draw(h,color(0,255,255,150))
      }
      move = selected.request(options)
    }
  }else { //ELSE FOR mouseIsPressed
    locked = false
    selected = -1
  }
  //console.log(move)
}
