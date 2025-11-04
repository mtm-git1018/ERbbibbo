import { RouterProvider } from "react-router";
import { router } from "../router/router";
import TanstackProvider from "../shared/providers/TanstackProvider";

function App() {
  return (
    <TanstackProvider>
      <RouterProvider router={router} />
    </TanstackProvider>
  );
}

export default App;
