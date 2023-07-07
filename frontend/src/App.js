import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupEventListPage from "./components/GroupEventListPage";
import SingleGroupDetails from "./components/Groups/SingleGroupDetails";
import SingleEventDetails from "./components/Events/SingleEventDetails";
import CreateGroup from "./components/Groups/CreateGroup";
import UpdateGroup from "./components/Groups/UpdateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // NEED TO ADD REDIRECTING IF NOT AUTHORIZED TO VISIT EACH ROUTE
  return (
    <div className="entire">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/groups">
            <GroupEventListPage showtype="groups" />
          </Route>
          <Route exact path="/events">
            <GroupEventListPage showtype="events" />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroup />
          </Route>
          <Route exact path="/groups/:groupId/edit">
            <UpdateGroup />
          </Route>
          <Route exact path="/groups/:groupId">
            <SingleGroupDetails />
          </Route>
          <Route exact path="/events/:eventId">
            <SingleEventDetails />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
