Isolated backend for sport bets contract. All dates are timestamp

api:
GET /games/iterate - should iterate over all games, and returns short information about each game

expected inputs:
req.body.startIndex,
req.body.sportType, - filter
req.body.beforeDate, - start date to filter before 
req.body.allowDraw, - filter

expected out:
[{
gameId
startDate 
description
}]
_______________________________________________
  
GET /games/details - returns detailed information about game
expected inputs:
gameId

expected out:
teams - team ids
payoutLock  - indicate if payment were done
wasRefund  - indicate if refund were done
endDate - game end date
minBetAmount - min amount that user cold bet in wei
allowDrawBets 
_______________________________________________________
POST /games/payout
expected inputs:
gameId

expected out:
200
_______________________________________________________
POST /games/refund
expected inputs:
gameId

expected out:
200
_______________________________________________________
GET /games/count - should return total games count
expected inputs:

expected out:
200
_______________________________________________________
POST /games/add - should create new game
expected inputs:
 req.body.game.sportType,
        req.body.game.teamIds, - array of team ids
        req.body.game.startDate,
        req.body.game.endDate,
        req.body.game.allowDraw,
        req.body.game.minBetAmount,
        req.body.game.description,
        req.body.game.gameId);

expected out:
200
_______________________________________________________
DELETE /games/ - should delete game by id, note: refund or payout should be done before
expected inputs:
gameId

expected out:
200
