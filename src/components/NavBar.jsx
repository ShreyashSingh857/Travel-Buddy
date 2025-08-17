import React from 'react'
import { useState,useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import globeIcon from '../assets/globeIcon.png';



const NavBar = () => {
    const[chooseDestToggle, setChooseDestToggle] = useState(false);
    const [destination, setDestination] = useState('');
    const [showSearch, setshowSearch] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const regexCity = /^[A-Za-z][A-Za-z\s\-'.]*$/;

    function handleDestinationClick() {
        
        if (chooseDestToggle) {
            if (!(regexCity.test(destination))) {               
                toast.error('Please enter a valid destination');
            } else {
                navigate('/destination/' + destination);
            }
            inputRef.current.style.display = 'none';
            setshowSearch(false);
            setChooseDestToggle(false);
            
        } else {
            inputRef.current.style.display = 'block';
            setshowSearch(true);
            setDestination('');
            setChooseDestToggle(true);

        }
    }
   
    
return (
    <div className="flex justify-between items-center p-4 m-4 rounded-2xl bg-white/10 backdrop-blur-2xl shadow-lg border border-white/30 ring-1 ring-white/40">
        <div className="flex items-center gap-4 cursor-pointer">
            <div 
            className="drop-shadow hover:bg-white/30 transition duration-300 p-2 rounded-full"
            onClick={() => { navigate('/') }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                <path d="M3 12L12 4l9 8v8a2 2 0 01-2 2h-3a2 2 0 01-2-2v-4h-2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
            </svg>
            </div>
            
        </div>
        <div className="flex items-center gap-2">
            <img src={globeIcon} alt="" className='w-10'/>
            <h1 className="text-2xl font-bold text-white navHead">Travel Buddy</h1>
        </div>
        <div className="flex items-center gap-4">
            <input
                type="text"
                className="inputDestination px-3 py-2 rounded-lg bg-white/5 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur"
                placeholder="Enter destination"
                ref={inputRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />
            <button 
            className="px-4 py-2 rounded-lg bg-white/20 text-white font-medium shadow hover:bg-white/30 transition backdrop-blur destinationButton"
            onClick={() => {
                handleDestinationClick();
            }}
            >
                {chooseDestToggle ? 'Search Destination' : 'Choose Destination'}
            </button>
        </div>
    </div>
)
}

export default NavBar