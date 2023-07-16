import { Socket } from "socket.io-client" 
import { io } from "socket.io-client"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Home.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}


function HomePage({socket}:HomePageProps){
    //click handler
    const navigate = useNavigate();
    const handleClick = (socket: Socket, msg:string) => {

        console.log('Socket ID:', socket.id);
        // Do something with the socket object, such as emit an event
        socket.emit('clickStart', { data: msg });
        setIsButtonClicked(true);
    };
    const [name, setName] = useState('');
    const [homeMessages, setHomeMessages] = useState<string[]>([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    useEffect(() => {
    socket.on('homeMessage', function (data) {
        setHomeMessages(data.data);
        
    });
    socket.on('NavToGame', function (data) {
            // Navigate to the GamePage route
        navigate('/game');
    });

    return () => {
        socket.off('homeMessage');
        socket.off('NavToGame');
    }




}, [socket]);

    
    return(
        <div className="sampleHomePage">
            <h1 className="sampleTitle">My Game</h1>
            <div className="inputContainer">
                <input className="inputField" onChange={(a) => { setName(a.target.value) }} placeholder="Enter Your Name"></input>
                <button className="playButton" onClick={() => handleClick(socket, name)} disabled={isButtonClicked}>Press to Ready</button>
            </div>
            <div className="messageContainer">
                {Object.entries(homeMessages).slice(-10).map(([key, value], index) => (
                    <div key={key} className="messageBox">{value} Connected</div>
                ))}
            </div>
        </div>
    )

}
export default HomePage