import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import VisualizationsPage from './pages/VisualizationsPage';
import ModelsPage from './pages/ModelsPage';


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          goToVisualizations={() => setCurrentPage('visualizations')}
          goToModels={() => setCurrentPage('models')}
        />
      )}
      {currentPage === 'visualizations' && (
        <VisualizationsPage goHome={() => setCurrentPage('home')} />
      )}
      {currentPage === 'models' && (
        <ModelsPage goHome={() => setCurrentPage('home')} />
      )}
    </>
  );
}

export default App;
