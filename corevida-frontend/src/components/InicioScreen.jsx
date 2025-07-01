import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import './InicioScreen.css';

const InicioScreen = () => {
  const navigate = useNavigate();

  const [cumpleanos, setCumpleanos] = useState('');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');

  const handleSiguienteClick = () => {
    if (cumpleanos.length !== 10 || !peso || !talla) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const [diaStr, mesStr, anoStr] = cumpleanos.split('/');
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);

    const fechaNacimiento = new Date(ano, mes - 1, dia);

    if (
      isNaN(fechaNacimiento.getTime()) ||
      fechaNacimiento.getFullYear() !== ano ||
      fechaNacimiento.getMonth() !== mes - 1 ||
      fechaNacimiento.getDate() !== dia
    ) {
      alert('La fecha de nacimiento no es válida. Por favor, revísala.');
      return;
    }
  
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      alert('Debes ser mayor de 18 años para registrarte.');
      return;
    }
    if (edad > 65) {
      alert('El servicio está disponible para usuarios de hasta 65 años.');
      return;
    }

    navigate('/inicio2', {
      state: {
        peso: parseFloat(peso),
        talla: parseFloat(talla)
      }
    });
  };

  return (
    <div className="inicio-container">
      <div className="inicio-overlay">
        <div className="inicio-content">
          <h1 className="inicio-title">Hola, soy NutrixIA. Tu bot asistente de confianza</h1>
          <p className="inicio-subtitle">Cuéntame sobre ti...</p>
          <div className="inicio-form">
            
            <div className="input-row">
              <label className="input-label">Fecha de Nacimiento</label>
              <IMaskInput
                mask="00/00/0000"
                placeholder="DD/MM/AAAA"
                value={cumpleanos}
                onAccept={(value) => setCumpleanos(value)}
                className="input-field"
              />
            </div>

            <div className="input-row">
              <label className="input-label">Peso</label>
              <input
                type="number"
                placeholder="(ejem. 70.5kg)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-row">
              <label className="input-label">Talla</label>
              <input
                type="number"
                placeholder="(ejem. 1.75m)"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <button onClick={handleSiguienteClick} className="siguiente-button">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default InicioScreen;