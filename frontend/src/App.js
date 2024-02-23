import { BrowserRouter } from 'react-router-dom';
import CreateRoutes from './routes/routes';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <CreateRoutes />
    </BrowserRouter>
  );
}


export default App;
