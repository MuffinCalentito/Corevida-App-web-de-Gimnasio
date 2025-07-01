import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RutinaScreen.css';

const RutinaScreen = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); 
  const [routine, setRoutine] = useState([]);
  const [dias, setDias] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentMuscleIndex, setCurrentMuscleIndex] = useState(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRoutine = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3001/api/user/routine', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setRoutine(response.data.routine);
        setDias(response.data.dias);

      } catch (error) {
        console.error("Error al cargar la rutina:", error);
        alert("No se pudo cargar tu rutina. Por favor, configura tus datos de nuevo.");
        navigate('/inicio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutine();
  }, [navigate]);


  useEffect(()=>{
    const showTimer = setTimeout(() => {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.show();
    }
  }, 100);

  return () => {
    if (window.voiceflow?.chat) {
      window.voiceflow.chat.hide();
    }
  };
  }, []);

  const handleDaySelect = (day) => {
    setCurrentDay(day);
    setCurrentMuscleIndex(0);
    setDropdownOpen(false);
  };

  const handlePrevMuscle = () => {
    const routineForDay = routine[currentDay - 1] || [];
    setCurrentMuscleIndex(prev => (prev > 0 ? prev - 1 : routineForDay.length - 1));
  };

  const handleNextMuscle = () => {
    const routineForDay = routine[currentDay - 1] || [];
    setCurrentMuscleIndex(prev => (prev < routineForDay.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return <div className="loading-screen">Cargando tu rutina personalizada...</div>;
  }

  const routineForDay = routine[currentDay - 1] || [];
  const currentGroup = routineForDay[currentMuscleIndex];

  return (
    <div className="rutina-container">
      <header className="rutina-header">
        <button className="header-btn" onClick={() => navigate('/')}>Salir</button>
        <h1 className="rutina-title">RUTINA</h1>
        <button className="header-btn" onClick={() => navigate('/inicio')}>Configurar rutina</button>
      </header>

      <main className="rutina-main">
        <div className="sub-header">
          {currentGroup && <h2>{currentGroup.muscle}</h2>}

          <div className="day-selector">
            <div className="day-display" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              Día: {currentDay}
              <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : ''}`}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {Array.from({ length: dias }, (_, i) => i + 1).map(day => (
                  <div key={day} className="dropdown-item" onClick={() => handleDaySelect(day)}>
                    Día {day}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {currentGroup ? (
          <div className="muscle-carousel">
            <button onClick={handlePrevMuscle} className="carousel-arrow left">←</button>
            
            <div className="muscle-info">
              <div className="exercises-grid">
                {currentGroup.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-card">
                    <div className="exercise-image-wrapper">
                      <img src={exercise.image} alt={exercise.name} className="exercise-image" />
                    </div>
                    <p className="exercise-name">{exercise.name}</p>
                    <p className="exercise-reps">{exercise.reps}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleNextMuscle} className="carousel-arrow right">→</button>
          </div>
        ) : (
          <div className="no-routine-data">No hay ejercicios para mostrar.</div>
        )}
      </main>
    </div>
  );
};

export default RutinaScreen;
