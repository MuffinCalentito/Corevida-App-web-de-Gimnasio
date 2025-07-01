import React, { useState } from 'react';
import './LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
        showAlert('Por favor, ingresa tu usuario y contraseña.', 'error');
        return;
    }

    try {
      const credentials = { username, password };
      const response = await axios.post('http://localhost:3001/api/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        showAlert(response.data.message, 'success');
        
        setTimeout(() => {
          if (response.data.isSetupComplete) {
            navigate('/rutina');
          } else {
            navigate('/inicio');
          }
        }, 1500);
      }
    } catch (error) {
      const message = error.response ? error.response.data.message : 'No se pudo conectar con el servidor.';
      showAlert(message, 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-content">
          <h1 className="login-title">Iniciar Sesion en Corevida</h1>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-row">
              <input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-row">
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Volver
            </button>
            <button className="btn btn-primary" onClick={handleLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;