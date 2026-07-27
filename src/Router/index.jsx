import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import { Auth, Cart, Home, NotFound, ProductDetails, Products, Profile } from "../Pages";
import Protected from "../Layout/Protected";
import UnProtected from "../Layout/UnProtected";
const router = createBrowserRouter([
  {
    path:'/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <Protected />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
        ],
      },
      {
        element: <UnProtected />,
        children: [
          {
            path: "auth",
            element: <Auth />,
          },
        ],
      },
      {
        path:'products/:categoryId/:categoryName',
        element:<Products/>
      },
      {
        path:'product-details/:id/:name',
        element:<ProductDetails/>
      },
      {
        path:'*',
        element:<NotFound/>
      }
    ],
  },
]);

export default router