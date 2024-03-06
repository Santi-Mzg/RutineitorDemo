import { HashRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';


function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/workout" element={<MainPage />} />
        <Route path="/workout/:date" element={<MainPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
