import React from 'react';
import './WelcomeScreen.css';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className='welcome-overlay'>
      <div className="welcome-content">
        <h1 className="welcome-title">
          Bienvenido a Corevida!
        </h1>
        <p className="welcome-subtitle">
          Tu servicio de confianza 💪
        </p>
        <div className="button-group">
          <button className="btn btn-register" onClick={() => navigate('/register')}>
            Registrarse
          </button>
          <button className="btn btn-login" onClick={() => navigate('/login')}>
            Iniciar Sesion
          </button>
        </div>
      </div>
      <footer className="welcome-footer">
        Derechos reservados
      </footer>
      </div>
    </div>
  );
};

export default WelcomeScreen;