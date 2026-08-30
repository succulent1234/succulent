import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Provider } from "./screens";

export default function App() {
  return <Provider><RouterProvider router={router} /></Provider>;
}
