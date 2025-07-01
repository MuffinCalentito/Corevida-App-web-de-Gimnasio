import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Inicio4Screen.css';

const Inicio4Screen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tiempo_entreno, setTiempoEntreno] = useState(null);

  const diasSeleccionados = location.state?.dias;

  const handleSelectTime = (time) => {
    setTiempoEntreno(time);
  };

  const handleNext = async () => {
    if (!tiempo_entreno) {
      alert("Por favor, selecciona cuánto tiempo vas a entrenar.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Sesión no válida. Por favor, inicia sesión de nuevo.");
        navigate('/login');
        return;
      }

      const setupData = {
        num_dias_entrenar: diasSeleccionados,
        tiempo_entreno: tiempo_entreno
      };

      await axios.put('http://localhost:3001/api/user/setup', setupData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      navigate('/rutina');

    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      alert('Hubo un error al guardar tu configuración. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="inicio4-container">
      <div className="inicio4-overlay">
        <div className="inicio4-content">
          <h1 className="main-question">¿Cuánto tiempo vas a entrenar por día? 😼</h1>
          <div className="options-container">
            <div
              className={`time-option ${tiempo_entreno === 30 ? 'active' : ''}`}
              onClick={() => handleSelectTime(30)}
            >
              30 minutos
            </div>
            <div
              className={`time-option ${tiempo_entreno === 60 ? 'active' : ''}`}
              onClick={() => handleSelectTime(60)}
            >
              60 minutos
            </div>
            <div
              className={`time-option ${tiempo_entreno === 90 ? 'active' : ''}`}
              onClick={() => handleSelectTime(90)}
            >
              90 minutos
            </div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Volver
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio4Screen;
