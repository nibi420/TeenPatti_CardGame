const { Socket } = require("socket.io");

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require('socket.io')
const cors = require('cors')
var path = require('path')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"]
        },
})

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req: any, res: any) => res.sendFile(__dirname + "/views/teenpatti.html"));

server.listen(3001, () => {
    console.log("SERVER IS LISTENING ON PORT 3001")
})

///
//Storing Variables Here:


let cardsDeck = [
    { rank: '2', suit: 'hearts' },
    { rank: '3', suit: 'hearts' },
    { rank: '4', suit: 'hearts' },
    { rank: '5', suit: 'hearts' },
    { rank: '6', suit: 'hearts' },
    { rank: '7', suit: 'hearts' },
    { rank: '8', suit: 'hearts' },
    { rank: '9', suit: 'hearts' },
    { rank: '10', suit: 'hearts' },
    { rank: 'j', suit: 'hearts' },
    { rank: 'q', suit: 'hearts' },
    { rank: 'k', suit: 'hearts' },
    { rank: 'a', suit: 'hearts' },
    { rank: '2', suit: 'diams' },
    { rank: '3', suit: 'diams' },
    { rank: '4', suit: 'diams' },
    { rank: '5', suit: 'diams' },
    { rank: '6', suit: 'diams' },
    { rank: '7', suit: 'diams' },
    { rank: '8', suit: 'diams' },
    { rank: '9', suit: 'diams' },
    { rank: '10', suit: 'diams' },
    { rank: 'j', suit: 'diams' },
    { rank: 'q', suit: 'diams' },
    { rank: 'k', suit: 'diams' },
    { rank: 'a', suit: 'diams' },
    { rank: '2', suit: 'clubs' },
    { rank: '3', suit: 'clubs' },
    { rank: '4', suit: 'clubs' },
    { rank: '5', suit: 'clubs' },
    { rank: '6', suit: 'clubs' },
    { rank: '7', suit: 'clubs' },
    { rank: '8', suit: 'clubs' },
    { rank: '9', suit: 'clubs' },
    { rank: '10', suit: 'clubs' },
    { rank: 'j', suit: 'clubs' },
    { rank: 'q', suit: 'clubs' },
    { rank: 'k', suit: 'clubs' },
    { rank: 'A', suit: 'clubs' },
    { rank: '2', suit: 'spades' },
    { rank: '3', suit: 'spades' },
    { rank: '4', suit: 'spades' },
    { rank: '5', suit: 'spades' },
    { rank: '6', suit: 'spades' },
    { rank: '7', suit: 'spades' },
    { rank: '8', suit: 'spades' },
    { rank: '9', suit: 'spades' },
    { rank: '10', suit: 'spades' },
    { rank: 'j', suit: 'spades' },
    { rank: 'q', suit: 'spades' },
    { rank: 'k', suit: 'spades' },
    { rank: 'a', suit: 'spades' },
]
function shuffleDeck(deck:any) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

let playerCount = 0;
let players: { [key: string]: string } = {};
let frontPlayers: { [key: string]: string } = {};


let valueMapping:  { [key: string]: number } = {

    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'j': 11,
    'q': 12,
    'k': 13,
    'a': 14,
}

let shuffledDeck = shuffleDeck(cardsDeck);

let playerCards: { [key: string] : {[key: string] : any[]} } = {};

let boardCards: { [key: string]: any }[] = [];
let valid = false;

let turn = 0;

io.on("connection", (socket: any) => {

    // console.log(shuffledDeck);

    console.log("Client connected with Socket ID:", socket.id)


    // console.log("TOTAL PARTICPANTS:");
    // for (const key in players) {
    //     console.log(players[key],"with",key);
    // }

    //add custom events here



    socket.on("clickStart", (myData: any) => {

        if(playerCount == 3)
        {
            io.emit("NavToGame");
            boardCards = shuffledDeck.splice(0, 1);
            
            
        }
        if (playerCount >= (4)) {

            socket.disconnect();
            console.log("The Room is Full! Disconnecting Socket..", socket.id);
            return;
        }


        console.log('Player Joined:', myData.data);
        players[socket.id] = myData.data;
        playerCount++;
        console.log(players);
        let playCards: { [key: string]: [] } = {};
        playCards['hiddenCards'] = shuffledDeck.splice(0, 3);
        playCards['showCards'] = shuffledDeck.splice(0, 3);
        playCards['myCards'] = shuffledDeck.splice(0, 3);
        playerCards[players[socket.id]] = playCards;
        playerCards[players[socket.id]] = playCards;
        playerCards[players[socket.id]] = playCards;
        io.emit("homeMessage", { data: players });

    })



    socket.on('GameUpdate', (data:any) =>{
        let special2 = false;
        let special7 = false;
        let special8 = false;
        let special10 = false;
        let hidBool = false;

        if(data.data == "start")
        {
            console.log("Game Update");
            console.log(playerCards[players[socket.id]]);
            console.log(players);
            // let turnArray = Object.keys(players);
            // turn = turnArray.indexOf(socket.id);
            // let turnNames = Object.values(players);
            // let turnMsg = turnNames[turn]
            io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualTurn: turn, message: "Game Started!"});
        }
        else
        {

            
                
            turn = turn % 4;
            console.log("Turn:", turn);

            //check for valid turn
            let turnArray = Object.keys(players);
            if(turn != turnArray.indexOf(socket.id))
            {
                io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualturn: turn, message: "Not your turn!"});
                return;
            }
            


            const boardTemp = boardCards.map(({ rank }) => rank);
            let mostRecentCard = boardTemp[boardTemp.length - 1];

            if (mostRecentCard == '2') {
                //implement refreshing card
                special2 = true;

            }

            if (mostRecentCard == '7') {
                //implement lower card
                special7 = true;
            }

            if (mostRecentCard == '8') {
                //implement invisible card
                special8 = true;
                mostRecentCard = boardTemp[boardTemp.length - 2]; // the recent card has shifted to the one below the top most cards
            }

            if (mostRecentCard == '10') {
                special10 = true;
                boardCards = [];// burnt the pile
                //implement burn the pile

            }


            //check if the user has valid cards or not?
            //myCards
            let tempCards = playerCards[players[socket.id]]['myCards'];
            tempCards = tempCards.map(o => o.rank);
            // const boardTemp = boardCards.map(({ rank }) => rank);
            // let mostRecentCard = boardTemp[boardTemp.length - 1]
            console.log(tempCards);
            for(let i = 0; i < tempCards.length; i++)
            {
                if(special7 == true)
                {

                    if (valueMapping[tempCards[i]] <= valueMapping[mostRecentCard]) {

                        valid = true;
                        break;
                    }

                }
                else
                {
                    if (valueMapping[tempCards[i]] >= valueMapping[mostRecentCard]) {

                        valid = true;
                        break;
                    }

                }
                
            }
            //showCards
            tempCards = playerCards[players[socket.id]]['showCards'];
            tempCards = tempCards.map(o => o.rank);

            console.log(tempCards);

            for(let i = 0; i < tempCards.length; i++)
            {
                if (special7 == true) {

                    if (valueMapping[tempCards[i]] <= valueMapping[mostRecentCard]) {

                        valid = true;
                        break;
                    }

                }
                else {
                    if (valueMapping[tempCards[i]] >= valueMapping[mostRecentCard]) {

                        valid = true;
                        break;
                    }

                }
            }




            // now we have to check if there are any power cards available
          


           

            if (data.sentCard['rank'] == '2' || data.sentCard['rank'] == '7' || data.sentCard['rank'] == '8' || data.sentCard['rank'] == '10') {

                valid = true;

            }

            if (data.sentCardType == "hiddenCards") {
                if (playerCards[players[socket.id]]['showCards'].length == 0 && playerCards[players[socket.id]]['myCards'].length == 0) {
                    hidBool = true;

                }
                else {

                    console.log("You can't send hidden cards if you have showCards or myCards");
                    io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualturn: turn, message: "You can't send hidden cards if you have showCards or myCards" });
                    return;

                }
            }
                        
            if(valid == false && hidBool == false)
            {
                //here it means that no valid cards or special cards are available
                
                console.log("Not Any Valid Cards Available! Take the whole deck!");
                //check if the user has any power cards
                
                // here it means that the user doesn't have any valid cards but its his turn
                // so we have to give him the whole deck
                let temp_cards = playerCards[players[socket.id]]['myCards'];
                for(let i = 0; i < boardCards.length; i++)
                {
                    temp_cards.push(boardCards[i]);
                }
                playerCards[players[socket.id]][data.sentCardType] = temp_cards; // add the new set of cards
                boardCards = [];// emtpy the board

                io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualturn: turn, message: "Not Any Valid Cards Available! Take the whole deck!" });
                return; // doesn't have any valid cards;
            }

            //works in anycase and the user registers the to the board.
           



            //check if the user has sent hidden cards and don't let him send hidden cards if he has myCards and showCards
           




            console.log("Valid:", valid);

            if(valid == true)
            {
                boardCards.push(data.sentCard);
                let temp_cards = playerCards[players[socket.id]][data.sentCardType];
                let index = temp_cards.indexOf(data.sentCard);
                temp_cards.splice(index, 1);// delete the card from the array
                temp_cards.push(shuffledDeck.splice(0, 1)[0]); // add a new card
                console.log("New CARDS:",temp_cards);
                playerCards[players[socket.id]][data.sentCardType] = temp_cards; // add the new set of cards

                console.log(playerCards);
                if(special2 == false)
                {
                    turn++;
                }
            }


            //implement win condition here:
            if (playerCards[players[socket.id]]['myCards'].length == 0 && playerCards[players[socket.id]]['showCards'].length == 0 && playerCards[players[socket.id]]['hiddenCards'].length == 0) {
                io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualturn: turn, message: "You Win!" });
                return;
            }

            io.emit('UpdateState', { cards: playerCards, names: players, board: boardCards, actualturn: turn, message: "Valid Move Sir" });

        }

     

    })




    socket.on("disconnect", () => {

        if (players[socket.id]) {
            console.log(players[socket.id], "has disconnected with socket ID", socket.id);
            delete (players[socket.id]);
            console.log(players)
            io.emit("homeMessage", { data: players });
            playerCount = playerCount - 1;
        }
        else {
            console.log("Extra Player", "has disconnected with socket ID", socket.id);

        }
    });




})
