import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModelConfidence from './components/ModelConfidence';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Render the ModelConfidence component */}
      <ModelConfidence />
    </>
  )
}

export default App
