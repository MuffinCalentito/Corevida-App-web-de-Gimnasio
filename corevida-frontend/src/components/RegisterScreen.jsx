import React, { useState } from 'react';
import './RegisterScreen.css';
import { useNavigate } from 'react-router-dom';
import {useAlert} from '../context/AlertContext';
import axios from 'axios';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleRegister = async () =>{
    if (!username || !email || !password) {
      showAlert('Por favor, completa todos los campos.', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Por favor, ingresa un formato de correo electrónico válido.', 'error');
      return;
    }

    try {
      const userData = { username, email, password };
      
      const response = await axios.post('http://localhost:3001/api/register', userData);

      showAlert(response.data.message, 'success')

      setTimeout(() => {
        navigate('/login');
      }, 1500);
      

    } catch (error) {
      const message = error.response ? error.response.data.message : 'No se pudo conectar con el servidor.';
      showAlert(message, 'error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-overlay">
      <div className="register-content">
        <h1 className="register-title">Regístrate en CoreVida</h1>
        <p className="register-subtitle">Disfruta de la nueva experiencia</p>

        <div className="input-group">
          <label htmlFor="username">Usuario</label>
          <div className='input-wrapper'>
            <input id="username" type="text" value={username} onChange={(e) => handleInputChange(e, setUsername)} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <div className='input-wrapper'>
            <input id="email" type="email" value={email} onChange={(e) => handleInputChange(e, setEmail)} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <div className='input-wrapper'>
            <input id="password" type="password" value={password} onChange={(e) => handleInputChange(e, setPassword)} />
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Volver
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            Registrarse
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterScreen;