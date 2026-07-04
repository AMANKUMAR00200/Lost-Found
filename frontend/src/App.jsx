import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SearchProvider } from "./context/SearchContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MyItems from "./pages/MyItems";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import ItemDetails from "./pages/ItemDetails";
import ChatList from "./pages/ChatList";
import LostItem from "./pages/LostItem";
import FoundItem from "./pages/FoundItem";

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyItems />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:receiverId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-list"
            element={
              <ProtectedRoute>
                <ChatList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items/:id"
            element={
              <ProtectedRoute>
                <ItemDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost"
            element={
              <ProtectedRoute>
                <LostItem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/found"
            element={
              <ProtectedRoute>
                <FoundItem />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;
