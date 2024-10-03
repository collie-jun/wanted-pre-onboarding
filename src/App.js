import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InfiniteScroll from './infiniteScroll.tsx';  


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<InfiniteScroll />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
