
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import WelcomeScreen from './components/WelcomeScreen.jsx';
import RegisterScreen from './components/RegisterScreen.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import InicioScreen from './components/InicioScreen.jsx';
import Inicio2Screen from './components/Inicio2Screen.jsx';
import Inicio3Screen from './components/Inicio3Screen.jsx';
import Inicio4Screen from './components/Inicio4Screen.jsx';
import RutinaScreen from './components/RutinaScreen.jsx';

function App() {
  useEffect(() => {
    // La función 'hide' de Voiceflow oculta el ícono del chat
    // Usamos un temporizador para darle tiempo al script de Voiceflow de cargarse
    const timer = setTimeout(() => {
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.hide();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <BrowserRouter>
      {}
      <Routes>
        {}
        <Route path="/" element={<WelcomeScreen />} />
        
        {}
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {}
        <Route path="/inicio" element={<InicioScreen />} />

        {}
        <Route path="/inicio2" element={<Inicio2Screen />} />

        {}
        <Route path="inicio3" element={<Inicio3Screen />}/>

        {}
        <Route path="inicio4" element={<Inicio4Screen />}/>

        {}
        <Route path="rutina" element={<RutinaScreen />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
