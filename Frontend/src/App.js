import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Login&Signup/Register';
import Login from './Login&Signup/Login';
import Generate from './Generate';
import Output from './Output';
import Favorites from './Favorites'; // Import Favorites component
import Album from './Album'; // Import Album component
import Design from './Design'; // Import Design component
import Account from './Account';
import Works from './Works';
const App = () => {
  const [favorites, setFavorites] = useState([]);

  const handleAddFavorite = (imageUrl) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.includes(imageUrl)) {
        return [...prevFavorites, imageUrl];
      }
      return prevFavorites;
    });
  };

  const handleRemoveFavorite = (imageUrl) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav !== imageUrl));
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Generate" element={<Generate />} />
          <Route
            path="/Output"
            element={<Output favorites={favorites} handleAddFavorite={handleAddFavorite} />}
          />
          <Route
            path="/Favorites"
            element={<Favorites favorites={favorites} handleRemoveFavorite={handleRemoveFavorite} />}
          />
            <Route path="/Album" element={<Album handleRemoveFavorite={handleRemoveFavorite} />} />
            <Route path="/Design" element={<Design />} />

            <Route path="/Works" element={<Works />} />
            
           
        </Routes>
      </div>
    </Router>
  );
};

export default App;

