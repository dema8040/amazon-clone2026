
import React, { useContext, useEffect } from "react";

import Routering from "./Router";

import { DataContext } from "./Components/DataProvider/DataProvider";

import { type } from "./Utility/action.type.js";

import { auth } from "./Utility/firebase.js";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch({
        type: type.SET_USER,
        user: user,
      });
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <Routering />;
}

export default App;

