import './App.css'
import  {createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import bgIMG from './assets/bg.jpg'
import bg2 from './assets/mountain-no-bg.png'
import { useRef, useEffect } from 'react';
import Destination from './components/Destination';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const layer1 = useRef(null);
  const layer2 = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e)=>{
      const x = (e.clientX/window.innerWidth - 0.5)*100;
      const y = (e.clientY/window.innerHeight - 0.5)*100;

      layer1.current.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
      layer2.current.style.transform = `translate(${x*0.4}px, ${y*0.4}px)`;
    };
    window.addEventListener('mousemove' , handleMouseMove);
  
    return () => {
      window.removeEventListener('mousemove' , handleMouseMove);
    }
  }, [])
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/destination/:id',
      element: <Destination />
    }
  ]);

  return (
    <>
      <div
        className='layer1'
        style={{
          backgroundImage: `url(${bgIMG})`,
          position: 'fixed',
          top: '-40px',
          left: '-40px',
          width: '110%',
          height: '110%',
          zIndex: 1,
          backgroundSize: 'cover',
          pointerEvents: 'none'
        }}
        ref={layer1}
      ></div>
      <div
        className='layer2'
        style={{
          backgroundImage: `url(${bg2})`,
          position: 'fixed',
          top: '-40px',
          left: '-40px',
          width: '110%',
          height: '110%',
          zIndex: 2,
          backgroundSize: 'cover',
          pointerEvents: 'none'
        }}
        ref={layer2}
      ></div>
      <div style={{ position: 'absolute', zIndex: 3,width: '100vw', height: '100vh', overflowY: 'auto' }} className='mainDiv '>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
