import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio3Screen.css'; // Asegúrate de crear este archivo CSS

const Inicio3Screen = () => {
    const navigate = useNavigate();
    const [num_dias_entrenar, setNumDiasEntrenar] = useState(null);

    const handleSelectDay = (days) => {
        setNumDiasEntrenar(days);
    };

    const handleNext = () => {
        if (!num_dias_entrenar) {
            alert("Por favor, selecciona cuántos días quieres entrenar.");
            return;
        }
        
        navigate('/inicio4', { state: { dias: num_dias_entrenar } });
    };

    return (
        <div className="inicio3-container">
            <div className="inicio3-overlay">
            <div className="inicio3-content">
                <h1 className="main-question">¿Cuántos días vas a entrenar a la semana? 😼</h1>

                <div className="options-container">
                    <div 
                        className={`day-option ${num_dias_entrenar === 3 ? 'active' : ''}`}
                        onClick={() => handleSelectDay(3)}
                    >
                        3 días
                    </div>
                    <div 
                        className={`day-option ${num_dias_entrenar === 4 ? 'active' : ''}`}
                        onClick={() => handleSelectDay(4)}
                    >
                        4 días
                    </div>
                    <div 
                        className={`day-option ${num_dias_entrenar === 6 ? 'active' : ''}`}
                        onClick={() => handleSelectDay(6)}
                    >
                        6 días
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

export default Inicio3Screen;
