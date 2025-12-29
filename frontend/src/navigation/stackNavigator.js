import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/index';
import Signup from '../pages/signup/index';
import Dashboard from '../pages/dashboard/index';
import ProjectsPage from '../pages/projects/ProjectsPage';
import CustomerDetailsPage from '../pages/customerDetails/CustomerDetailsPage';
import Rupin from '../pages/rupin/rupin';
import WindowDetailsPage from '../pages/windowDetails/WindowDetailsPage';
import CurtainDetailsPage from '../pages/curtainDetails/CurtainDetailsPage';
import BlindDetailsPage from '../pages/blindDetails/BlindDetailsPage';
import RoomsSection from '../pages/roomSection/RoomsSection';
import RoomWindowsPage from '../pages/roomWindows/RoomWindowsPage';

function StackNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/projects' element={<ProjectsPage />} />
        <Route path='/rupin' element={<Rupin />} />
        <Route path='/customers/:id' element={<CustomerDetailsPage />} />
        <Route path='/windows/:id' element={<WindowDetailsPage />} />
        <Route path='/curtains/:windowId' element={<CurtainDetailsPage />} />            
        <Route path='/curtains/add/:windowId' element={<CurtainDetailsPage />} />        
        <Route path='/blinds/:windowId' element={<BlindDetailsPage />} />                
        <Route path='/blinds/add/:windowId' element={<BlindDetailsPage />} />           
        <Route path='/rooms/:clientId' element={<RoomsSection />} />
        <Route path='/rooms/:roomId/windows' element={<RoomWindowsPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default StackNavigator;
