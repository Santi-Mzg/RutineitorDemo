import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';


function App() {

  return (
        <BrowserRouter>
          <Routes>
              <Route path="/workout" element={<MainPage />} />
              <Route path="/workout/:date" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
  )
}

export default App
