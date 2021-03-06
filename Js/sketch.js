
function flipT(t){
  /* Depricated */
  // if(t){
  //   return false
  // }else {
  //   return true
  // }
  return null
}

function shallow_copy(){
  /**
  Makes a shallow copy of a board. changes to this board will not affect the
  original board. returns the shallow copy
  */
  let copy_board = []
  let copy_all_pieces = []
  let copy_pieces
  for (var i = 0; i < 8; i++){
    copy_board[i] = new Array(8)
  }

  for (var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      copy_board[i][j] = new spot(board[i][j].x, board[i][j].y)
      if(board[i][j].occ.length !== 0){
        copy_pieces = new piece(board[i][j].occ[0].x, board[i][j].occ[0].y, board[i][j].occ[0].type, board[i][j].occ[0].alliance)
        append(copy_all_pieces, copy_pieces)
        append(copy_board[i][j].occ, copy_pieces)
      }
    }
  }
  return [copy_board, copy_all_pieces]
}

function save_matching_options(comparedList, possibleMoves){
  /*
  Takes two arrays of coordinates. Compares the two arrays and retuns an array
  of coordiantes that are found in both lists
  */
  let temp_set = new Set()
  for (var i = 0; i < possibleMoves.length; i++){
    for (var j = 0; j < comparedList.length; j++){
      if (board[possibleMoves[i][0]][possibleMoves[i][1]] == board[comparedList[j][0]][comparedList[j][1]]){
        temp_set.add(possibleMoves[i])
      }
    }
  }
  return [...temp_set]
}

function remove_covered_options(comparedList, allegiance){
  /*
  Checks if spot objects on the board that are in the array are being
  covered by other peices of proper allegiance

  comparedList : Array of coordinates arrays
  allegiance : bool
  Returns nothing but modifies the array
  */
  let opt = []
  for(var i = 0; i<allPieces.length; i++){
    if(allPieces[i].alive && allPieces[i].alliance == allegiance){
      if(allPieces[i].type === 'p'){
        if(!allPieces[i].alliance){ //if black
          if (allPieces[i].y + 1 <= 7){
            if(allPieces[i].x + 1 <= 7){
              if(board[allPieces[i].x+1][allPieces[i].y+1].occ.length == 0 || !board[allPieces[i].x+1][allPieces[i].y+1].occ[0].alliance){
                append(opt, [allPieces[i].x+1, allPieces[i].y+1, true])
              }
            }
            if(allPieces[i].x-1 >= 0){
              if (board[allPieces[i].x-1][allPieces[i].y+1].occ.length == 0 || !board[allPieces[i].x-1][allPieces[i].y+1].occ[0].alliance) {
                append(opt, [allPieces[i].x-1, allPieces[i].y+1, true])
              }
            }
          }
        }
        if(allPieces[i].alliance){ //White
          if (allPieces[i].y - 1 >= 0){
            if(allPieces[i].x+1 <= 7){
              if(board[allPieces[i].x+1][allPieces[i].y-1].occ.length == 0 || board[allPieces[i].x+1][allPieces[i].y-1].occ[0].alliance){
                append(opt, [allPieces[i].x+1, allPieces[i].y-1, true])
              }
            }
            if(allPieces[i].x-1 >= 0){
              if (board[allPieces[i].x-1][allPieces[i].y-1].occ.length == 0 || board[allPieces[i].x-1][allPieces[i].y-1].occ[0].alliance) {
                append(opt, [allPieces[i].x-1, allPieces[i].y-1, true])
              }
            }
          }
        }
      }
      else{
        opt = allPieces[i].fMove(board)
      }
      for(var a = 0; a<opt.length; a++){
        for(var b = 0; b<comparedList.length; b++){
          if(board[opt[a][0]][opt[a][1]] === board[comparedList[b][0]][comparedList[b][1]]){
            comparedList.splice(b, 1)
            b--
          }
        }
      }
    }
  }
} // end of function

function find_safe_moves(pieceChecked){
  /*
  Finds all legal moves for a piece and returns and array with those moves
  pieceChecked : Piece object
  */
  let run_away = pieceChecked.fMove(board)
  let pawn_block = false
  //In order to check a checkmate the king has to be removed
  pieceChecked.alive = false
  board[pieceChecked.x][pieceChecked.y].clear()
  remove_covered_options(run_away, !pieceChecked.alliance)
  // After the check the king can return
  pieceChecked.alive = true
  append(board[pieceChecked.x][pieceChecked.y].occ, pieceChecked)
  total = 0
  for (a = 0; a < run_away.length; a++){
    if(run_away[a].length > 2){
      /* This must be done one at a time because removal of peices is nessesairy
        Must be 2d array because of how remove_covered_options() works */
      var target_coord = [[run_away[a][0], run_away[a][1]]]
      var temp_piece_holder = board[target_coord[0][0]][target_coord[0][1]].occ[0]
      /* Piece must be removed in order for a check to work */
      temp_piece_holder.alive = false
      board[temp_piece_holder.x][temp_piece_holder.y].clear()
      remove_covered_options(target_coord, !pieceChecked.alliance)
      /* After the check it comes back so that it may impact the other peices
        checks if any */
      temp_piece_holder.alive = true
      append(board[temp_piece_holder.x][temp_piece_holder.y].occ, temp_piece_holder)
      if (target_coord.length == 0){
        run_away.splice(a, 1)
        a--
      }
    }
    total++
  }
  return run_away
}

function find_possible_blocking_spots(threatning, king){
  /*
  Finds all possible spots where a check block could occur
  returns an array of the spots.
  */
  let type = threatning.type
  let start = [king.x, king.y]
  let stop = [threatning.x, threatning.y]
  let returnArr = []
  let direction

  if(stop[0] < start[0]){
    if (stop[1] < start[1]){
      direction = [-1, -1] // bL
    }else if (stop[1] > start[1]) {
      direction = [-1, 1] // tL
    }else {
      direction = [-1, 0] // L
    }
  }else if (stop[0] > start[0]){
    if (stop[1] < start[1]){
      direction = [1, -1] //bR
    }else if (stop[1] > start[1]){
      direction = [1, 1] //tR
    }else {
      direction = [1, 0] //R
    }
  }else {
    if (stop[1] < start[1]){
      direction = [0, -1] //b
    }else if (stop[1] > start[1]){
      direction = [0, 1] //t
    }
  }
  for (i = 0; !(start[0] == stop[0] && start[1] == stop[1]); i++){
    append(returnArr, [start[0], start[1]])
    start[0] += direction[0]
    start[1] += direction[1]
  }
  returnArr.shift()
  return returnArr
}

function check(simulate, board_to_analyze, piece_list){
  /**
  Checks the board state to verify for a check. If there is one verifies if the
  check state is actually a checkmate state. The option to simulate does not go
  further than changing wCheck or bCheck. The board that is being analyzed must
  also be passed in along with a list of peice objects representing every peice
  on the board. This is to make sure during a simulation the real board is
  not being changed.

  To create a simulation board utilize shallow_copy()

  Returns: true if checkmate, false if no checkmate
  */
  let bCount = 0
  let wCount = 0
  let threat
  let dangerKing
  for(var i = 0; i < piece_list.length; i++){
    if(piece_list[i].alive){
      let opt = piece_list[i].fMove(board_to_analyze)
      for(var j = 0; j<opt.length; j++){
        if(opt[j][2] && board_to_analyze[opt[j][0]][opt[j][1]].occ[0].type == 'k'){
          threat = piece_list[i]
          dangerKing = board_to_analyze[opt[j][0]][opt[j][1]].occ[0]
          if(board_to_analyze[opt[j][0]][opt[j][1]].occ[0].alliance){
            wCount++
          }else{
            bCount++
          }
        }
      }
    }
  }
  if(wCount > 0){ // Mainly used for sideBoard
    wCheck = true
  }else {
    wCheck = false
  }
  if(bCount > 0){
    bCheck = true
  }else {
    bCheck = false
  }
  //CHECKMATE
  if((wCheck || bCheck) && !simulate){
    let escape_options = find_safe_moves(dangerKing)
    blockingSpots = []

    possibleCheckmate = true
    let pre_length
    let post_length
    let possible_blocking_spots = []
    let threat_pos = [threat.x, threat.y, true]
    if (!(threat.type == 'p') && !(threat.type == 'kn')){
      possible_blocking_spots = find_possible_blocking_spots(threat, dangerKing)
    }
    append(possible_blocking_spots, threat_pos)
    blockingSpots = [...possible_blocking_spots] // copying array so it isn't affected by further changes
    pre_length = possible_blocking_spots.length
    dangerKing.alive = false
    board_to_analyze[dangerKing.x][dangerKing.y].clear()
    remove_covered_options(possible_blocking_spots, !threat.alliance)
    dangerKing.alive = true
    append(board_to_analyze[dangerKing.x][dangerKing.y].occ, dangerKing)
    post_length = possible_blocking_spots.length

    return !(post_length < pre_length)
  }
}

function check_if_pinned(potentially_pinned){
  // JUST REMOVING DOES NOT WORK. CHECK EVERY REASONABLE POSSIBLE MOVE,
  // IE. If moving 1 to the right resuts in a check make sure you dont keep checking that direction
  /**
  Simulates the removal of a peice and runs the check function, if a check state
  occurs for the allied king, the peice is considered pinned.
  *** It is vital that all variables modified here are reset ! ***
  returns True if the peice is pinned, false if it is not.
  */
  const pre_change_w_check = wCheck
  const pre_change_b_check = bCheck
  const side = potentially_pinned.alliance
  const original_spot = [potentially_pinned.x, potentially_pinned.y]
  let return_state
  wCheck = false
  bCheck = false

  potentially_pinned.alive = false // Remove peice
  board[potentially_pinned.x][potentially_pinned.y].clear()

  check(simulate=true, board, allPieces) // Run check

  potentially_pinned.alive = true // Return peice
  append(board[potentially_pinned.x][potentially_pinned.y].occ, potentially_pinned)

  // Verify that the correct side got checked
  if (wCheck && side) { return_state = true }
  else if (bCheck && !side) { return_state = true }
  else { return_state = false }

  // Finding moves that a peice can make while pinned
  // making copies so the real board state is not affected
  let allowed_pinned_moves = []
  let movement = []
  if ((wCheck && side) || (bCheck && !side)){
    let copied_return
    let board_copy
    let all_pieces_copy
    let copy_piece
    movement = potentially_pinned.fMove(board)
    for (var i = 0; i < movement.length; i++){
      copied_return = shallow_copy()
      board_copy = copied_return[0]
      all_pieces_copy = copied_return[1]
      copy_piece = board_copy[potentially_pinned.x][potentially_pinned.y].occ[0]

      wCheck = false
      bCheck = false

      board_copy[movement[i][0]][movement[i][1]].advance(copy_piece)
      board_copy[copy_piece.x][copy_piece.y].clear()
      copy_piece.change(movement[i])

      check(simulate=true, board_copy, all_pieces_copy)

      if (!(wCheck && side) && !(bCheck && !side)){
        append(allowed_pinned_moves, movement[i])
      }
    }
  }

  // Resetting globals that were changed
  wCheck = pre_change_w_check
  bCheck = pre_change_b_check
  return [return_state, allowed_pinned_moves]
}

function sideBoard(all){ // Draws the side board
  strokeWeight(3)
  textAlign(CENTER, CENTER)
  let p = [["P",0 ,0], ["N",0 ,0], ["B",0 ,0], ["R",0 ,0], ["Q",0 ,0]]
  for(var i = 0; i<all.length; i++){ // For black captures
    if(all[i].alliance && !all[i].alive){
      switch (all[i].type) {
        case 'p':
          p[0][1]++
          break;
        case 'kn':
          p[1][1]++
          break;
        case 'b':
          p[2][1]++
          break;
        case 'r':
          p[3][1]++
          break;
        case 'q':
          p[4][1]++
          break;
      }
    }
  }
  if(!turn){
    stroke(255,200,0)
  }else {
    stroke(0)
  }
  fill(0) //BLACK RECT
  rect(803,0,150,400,10)

  //TEXT ON BLACK
  stroke(0); fill(255); textSize(20); textStyle(BOLD);
  text("BLACK", 876,30)
  for(var i = 0; i < 5; i++){
    text(p[i][0], 820, 100+50*i)
    for(var j = 0; j< p[i][1]; j++){
      ellipse(850+8*j, 100+50*i, 10, 10)
    }
  }
  //BLACK CHECK
  text("CHECK", 860,360)
  if(bCheck){
    fill(255,0,0)
    ellipse(920, 359, 25, 25)
  }

  for(var i = 0; i<all.length; i++){ // For white captures
    if(!all[i].alliance && !all[i].alive){
      switch (all[i].type) {
        case 'p':
          p[0][2]++
          break;
        case 'kn':
          p[1][2]++
          break;
        case 'b':
          p[2][2]++
          break;
        case 'r':
          p[3][2]++
          break;
        case 'q':
          p[4][2]++
          break;
      }
    }
  }

  if(turn){
    stroke(255,200,0)
  }else {
    stroke(0)
  }
  fill(255)
  rect(803,400,150,400,10)//WHITE RECT

  //TEXT ON WHITE
  stroke(255); fill(0); textSize(20);
  text("WHITE", 876,430)
  for(var i = 0; i < 5; i++){
    text(p[i][0], 820, 500+50*i)
    for(var j = 0; j< p[i][2]; j++){
      ellipse(850+8*j, 500+50*i, 10, 10)
    }
  }

  text("CHECK", 860,760)
  if(wCheck){
    fill(255,0,0)
    ellipse(920, 759, 25, 25)
  }

  fill(0)
  stroke(0)
  strokeWeight(2)//RESET
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
let turn = true
let wCheck = false
let bCheck = false
let possibleCheckmate = false
let selected
let options
let blockingSpots = -1
let move = -1
//----SETUP STARTS----//
function setup() {
  createCanvas(953, 800);
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

}

function mouseReleased(){
  if(move.length > 1 && selected !== -1){
    board[move[0]][move[1]].advance(selected)
    board[selected.x][selected.y].clear()
    selected.change(move)
    turn = !turn
    move = -1
  }
}

function draw() {
  background(255);
  const h = 800/8
  //DRAW BOARD
  for (var i = 0; i < 8; i++){
    for (var j = 0; j < 8; j++){
      selected_spot = board[i][j]
      selected_spot.draw(h, selected_spot.getColor())
    }
  }
  //SHOW ALL PIECES
  for (var i = 0; i < allPieces.length; i++){
    if(allPieces[i].alive){
      if(mouseIsPressed){
        if(allPieces[i].alliance === turn){
          if(allPieces[i].over(h) && !lLocked){
            allPieces[i].selected = true
            lLocked = true
          }
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
  }
  //SHOW SIDEBOARD
  sideBoard(allPieces)

  //------MOUSE ACTIONS------//
  if(mouseIsPressed){
    for(var i = 0; i < allPieces.length && !locked; i++){
     if(allPieces[i].alive){
        if(allPieces[i].alliance === turn){
          if(allPieces[i].over(h)){
            selected = allPieces[i]
            locked = true
          }
        }
      }
    }
    if(selected !== -1){
      if (selected.type == 'k'){
        options = find_safe_moves(selected)
      }else {
        let pinned = check_if_pinned(selected)
        if (pinned[0]){ // Verify that the peice is not pinned
          options = pinned[1]
        }
        if (wCheck || bCheck){ //TODO: YOu can still move other peices when king is in check. Change this
          options = save_matching_options(blockingSpots, selected.fMove(board))
          blockingSpots = -1
          possibleCheckmate = false
        }else if (!pinned[0]){
          options = selected.fMove(board)
        }
      }
      for(var i = 0; i<options.length; i++){
        if(options[i][2] == true){
          board[options[i][0]][options[i][1]].draw(h,color(255,0,0,110))
        }else{
          board[options[i][0]][options[i][1]].draw(h,color(0,255,255,150))
        }
      }
      move = selected.request(options)
    }
  }else { //ELSE FOR mouseIsPressed
    locked = false
    selected = -1
  }
  // Mouse actions end
  if(check(simulate=false, board, allPieces)){ // CHECK FOR CHECK and CHECKMATE
    console.log("CHECKMATE")
  }
}
