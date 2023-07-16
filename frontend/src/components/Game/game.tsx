import { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
// import './playing-cards.css'
// import './teenpatti.css'

import { useEffect, useState } from "react";

//create an interface for the props that you want to pass to this component
interface GamePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}

type CardProps = {
    rank: string;
    suit: string;
};

type CardsDeckProps = {
    card: CardProps;
}


function CardsDeck({card, socket, bCards, setBCards }: CardsDeckProps & GamePageProps & { bCards: any, setBCards: any }) {
    const { rank, suit } = card;

    const handleClick = () => {
        console.log(`Clicked on the ${rank} of ${suit}`);
        console.log(card);
        socket.emit('GameUpdate', {sentCardType:"myCards", sentCard:card});

    }

    return (
        <li>
            <a className={`card rank-${rank} ${suit}`} onClick={handleClick}>
                <span className="rank">{rank}</span>
                <span className="suit" dangerouslySetInnerHTML={{ __html: `&${suit};` }}></span>
            </a>
        </li>
    );
}


function CardsDeckShow({ card, socket, bCards, setBCards }: CardsDeckProps & GamePageProps & { bCards: any, setBCards: any }) {
    const { rank, suit } = card;

    const handleClick = () => {
        console.log(`Clicked on the ${rank} of ${suit}`);
        console.log(card);
        socket.emit('GameUpdate', { sentCardType: "showCards" ,sentCard: card});

    }

    return (
        <li>
            <a className={`card rank-${rank} ${suit}`} onClick={handleClick}>
                <span className="rank">{rank}</span>
                <span className="suit" dangerouslySetInnerHTML={{ __html: `&${suit};` }}></span>
            </a>
        </li>
    );
}
function CardsDeckHidden({ card, socket, bCards, setBCards }: CardsDeckProps & GamePageProps & { bCards: any, setBCards: any }) {

    const { rank, suit } = card;

    const handleClick = () => {
        console.log(`Clicked on the ${rank} of ${suit}`);
        socket.emit('GameUpdate', { sentCardType: "hiddenCards", sentCard: card });
    }

    return (
        
        <li>
            <a className="card back" onClick ={handleClick}>*</a>
        </li>


    );
}

function BoardCardsDeck({ card }: CardsDeckProps) {
    const { rank, suit } = card;

    return (
        <li>
            <div className={`card rank-${rank} ${suit}`}>
                <span className="rank">{rank}</span>
                <span className="suit" dangerouslySetInnerHTML={{ __html: `&${suit};` }}></span>
            </div>
        </li>
    );
}

function BoardCardsDeckHidden({ card }: CardsDeckProps) {

    const { rank, suit } = card;

    return (

        <li>
            <div className="card back">*</div>
        </li>


    );
}




function GamePage({ socket }: GamePageProps) {
    //click handler
    const [players, setPlayers] = useState<string[]>([]);

    const [allPlayerCards, setAllPlayerCards] = useState({}); // [player1, player2, player3]
   
    const [boardCards, setBoardCards] = useState([]);
    const [myCards, setMyCards] = useState([]);
    const [showCards, setShowCards] = useState([]);
    const [hiddenCards, setHiddenCards] = useState([]);
    const [playerNames, setPlayerNames] = useState({}); // [player1, player2, player3
    const [myName, setMyName] = useState("");
    const [player1showCards, setPlayer1showCards] = useState([]);
    const [player2showCards, setPlayer2showCards] = useState([]);
    const [player3showCards, setPlayer3showCards] = useState([]);
    const [player1hiddenCardsNum, setPlayer1hiddenCardsNum] = useState([]);
    const [player2hiddenCardsNum, setPlayer2hiddenCardsNum] = useState([]);
    const [player3hiddenCardsNum, setPlayer3hiddenCardsNum] = useState([]);
    const [turn, setTurn] = useState(0);
    const [message,setMessage] = useState("");
    const [turnMessage, setTurnMessage] = useState("");
    useEffect(() => {



        socket.emit('GameUpdate', {data: "start"});

        socket.on('UpdateState', (data) => {
            console.log("here");
            setPlayers(((Object.values(data.names) as string[]).filter((value) => value !== (data.names[socket.id]))))
            let player_array = ((Object.values(data.names) as string[]).filter((value) => value !== (data.names[socket.id])))
            setPlayerNames(data.names)
            // console.log(data.names);
            // console.log(data.cards);
            // console.log((data.names[socket.id]))
            setHiddenCards((data.cards[(data.names[socket.id])]['hiddenCards']));
            setShowCards((data.cards[(data.names[socket.id])]['showCards']));
            setMyCards((data.cards[(data.names[socket.id])]['myCards']));
            setMyName((data.names[socket.id]));    
            setPlayer1showCards((data.cards[(player_array[0])]['showCards']));
            setPlayer2showCards((data.cards[(player_array[1])]['showCards']));
            setPlayer3showCards((data.cards[(player_array[2])]['showCards']));
            setBoardCards(data.board);
            setTurn(data.actualTurn);
            setMessage(data.message);
            console.log(data.board)

            
    

        });

        return () => {
        
            socket.off('UpdateState');
        }



    }, [socket]);



    return (
        <div className="main-container playingCards">

            <div className="game-container">
                <div className="heading-container">
                    <h1>Teen Patti</h1>
                </div>
                <div className="game-table-container">
                    <div className="game-table" >
                        <div className="card-area">
                            <ul className="hand remove-margin">
                                {boardCards.map((card, index) => (
                                    <BoardCardsDeck key={index} card={card} />
                                ))}
                            </ul>
                        </div>


                        <div className="game-players-container">
                            <div className="player-tag player-one">{players[0]}</div>
                            <ul className="hand remove-margin player-one-cards">
                                P1
                                {hiddenCards.map((card, index) => (

                                    <BoardCardsDeckHidden key={index} card={card} />
                                ))}
                                {player1showCards.map((card, index) => (

                                    <BoardCardsDeck key={index} card={card} />
                                ))}
                                
                            </ul>
                        </div>

                        <div className="game-players-container">
                            <div className="player-tag player-two">{players[1]}</div>
                            <ul className="hand remove-margin player-two-cards">
                                P2
                                {hiddenCards.map((card, index) => (

                                    <BoardCardsDeckHidden key={index} card={card} />
                                ))}
                                {player2showCards.map((card, index) => (

                                    <BoardCardsDeck key={index} card={card} />
                                ))}
                            </ul>
                        </div>

                        <div className="game-players-container">
                            <div className="player-tag player-three">{players[2]}</div>
                            <ul className="hand remove-margin player-three-cards">
                                P3
                                {hiddenCards.map((card, index) => (

                                    <BoardCardsDeckHidden key={index} card={card} />
                                ))}
                                {player3showCards.map((card, index) => (

                                    <BoardCardsDeck key={index} card={card} />
                                ))}
                            </ul>
                        </div>

                        <div className="game-players-container">
                            <div className="player-tag player-four">{myName}</div>
                            <ul className="hand remove-margin player-four-cards">
                                My Deck
                                {hiddenCards.map((card, index) => (

                                    <BoardCardsDeckHidden key={index} card={card} />
                                ))}
                                {showCards.map((card, index) => (

                                    <BoardCardsDeck key={index} card={card} />
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <div className="messages-and-cards-container">
                <div className="right-side-container messages-container">
                    <h1>Messages</h1>
                    <div className="message-box">
                        <div className="message-content-container">
                            {message}
                        </div>
                    </div>
                </div>
                <div className="right-side-container my-cards-container">
                    <h1>My Cards</h1>
                    <div className="my-cards-inner-container">
                        <ul className="hand remove-margin">
                        {myCards.map((card, index) => (
                            <CardsDeck key={index} card={card}
                                bCards={boardCards}
                                setBCards={setBoardCards}
                                socket={socket}
                                />
                        ))}
                        </ul>
                    </div>

                    <div className="my-fixed-cards-container">
                        <ul className="hand remove-margin">
                            {hiddenCards.map((card,index) => (

                                <CardsDeckHidden key={index} card={card} bCards={boardCards}
                                    setBCards={setBoardCards} socket={socket} />
                            ))}
                            {showCards.map((card, index) => (

                                <CardsDeckShow key={index} card={card} bCards={boardCards}
                                    setBCards={setBoardCards}
                                    socket={socket} />
                            ))}

                           
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default GamePage