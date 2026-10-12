import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Components from "./pages/Components";
import { Login, Signup } from "./pages/auth/AuthForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Onboarding from "./pages/auth/Onboarding";
import { Trips } from "./pages/Trips";
import TripPlanner from "./pages/TripPlanner";
import SharedTrip from "./pages/SharedTrip";
import Notifications from "./pages/Notifications";
import Guides from "./pages/guides/Guides";
import GuideView from "./pages/guides/GuideView";
import GuideEditor from "./pages/guides/GuideEditor";
import Explore from "./pages/explore/Explore";
import Destination from "./pages/explore/Destination";
import Hotels from "./pages/booking/Hotels";
import HotelDetail from "./pages/booking/HotelDetail";
import Flights from "./pages/booking/Flights";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/profile/Settings";
import AppPage from "./pages/site/AppPage";
import { Help, HelpArticle, HelpTopic } from "./pages/site/Help";
import { Blog, BlogPostPage } from "./pages/site/Blog";
import { About, Contact, Privacy, Terms } from "./pages/site/Static";
import { NotFound, ServerError, States } from "./pages/site/Errors";
import { CookieBanner } from "./components/ui";
import Pricing from "./pages/Pricing";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ScrollTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:slug" element={<Destination />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guide/:id" element={<GuideView />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/trip/:id/share" element={<SharedTrip />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/topic/:cat" element={<HelpTopic />} />
          <Route path="/help/:id" element={<HelpArticle />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/states" element={<States />} />
          <Route path="/components" element={<Components />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trip/:id" element={<TripPlanner />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/guides/new" element={<GuideEditor />} />
            <Route path="/guide/:id/edit" element={<GuideEditor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/:section?" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </AuthProvider>
    </HashRouter>
  );
}
