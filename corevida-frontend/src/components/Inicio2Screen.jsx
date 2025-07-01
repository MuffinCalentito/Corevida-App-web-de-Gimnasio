import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Inicio2Screen.css';

const Inicio2Screen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [imc, setImc] = useState(null);

    useEffect(() => {
        const { peso, talla } = location.state || {};

        if (peso && talla > 0) {
            const imcCalculado = peso / (talla * talla);
            setImc(imcCalculado.toFixed(1));
        } else {
            navigate('/inicio');
        }
    }, [location.state, navigate]);

    const getRecommendation = () => {
        if (!imc) return '';
        if (parseFloat(imc) < 25.0) {
            return (
                <>
                    Como tu asistente recomiendo realizar un entrenamiento enfocado en el volumen 🤓☝️
                    <br />
                    Estas de acuerdo?🤔
                </>
            );
        } else {
            return (
                <>
                    Como tu asistente recomiendo realizar un entrenamiento enfocado en la definición 🤓☝️
                    <br />
                    Estas de acuerdo?🤔
                </>
            );
        }
    };

    const getCategoryClass = (min, max) => {
        if (!imc) return 'imc-category';
        const imcValue = parseFloat(imc);
        if (imcValue >= min && imcValue <= max) {
            return 'imc-category active';
        }
        return 'imc-category';
    };

    if (!imc) {
        return <div className="loading-container">Calculando IMC...</div>;
    }

    return (
        <div className="inicio2-container">
            <div className="inicio2-overlay">
            <div className="inicio2-content">
                <h1 className="imc-title">Tienes un indice de masa corporal de {imc}.</h1>

                <div className="imc-categories">
                    <div className={getCategoryClass(0, 18.4)}>IMC bajo: menos de 18.5</div>
                    <div className={getCategoryClass(18.5, 24.9)}>IMC normal: 18.5 - 24.9</div>
                    <div className={getCategoryClass(25.0, 29.9)}>IMC sobrepeso: 25.0 - 29.9</div>
                    <div className={getCategoryClass(30.0, Infinity)}>IMC obesidad: 30.0 - a mas</div>
                </div>

                <p className="recommendation-text">{getRecommendation()}</p>

                <div className="button-group">
                    <button className="btn btn-secondary" onClick={() => navigate('/inicio')}>
                        Volver
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/inicio3')}>
                        Vamos por ese entrenamiento
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Inicio2Screen;