import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, anonymous = false }) {
  // Invoke the useLocation hook and access the value of the
  // 'from' property from its state object. If there is no 'from'
  // property we default to "/".
  const location = useLocation();
  const from = location.state?.from || "/";

  // // Destructure isLoggedIn from the value provided by AppContext
  const { isLoggedIn } = useContext(AppContext);

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isLoggedIn) {
    // While redirecting to /login we set the location objects
    // state.from property to store the current location value.
    // This allows us to redirect them appropriately after they
    // log in.
    return <Navigate to="/login" state={{ from: location }} />;
  }
  // Otherwise, display the children of the current route.
  return children;
}

export default ProtectedRoute;

// The anonymous prop will specify whether a route can be accessed “anonymously” (i.e., without authentication).
// We will use this to direct logged-in users away from the /login and /register routes.

// When redirecting users to the /login route, store the current location in the useLocation hook’s state object.
// This will allow us to redirect users to the route they initially tried to access.
// EX: if a user initially navigates to /my-profile, but is redirected to /login,
// we would like to send them to /my-profile after they log in.
