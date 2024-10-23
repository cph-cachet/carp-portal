import LoadingLandingPage from "@Components/Layout/LoadingLandingPage";
import { useAuth } from "react-oidc-context";
import { Navigate, Route, Routes } from "react-router-dom";
import Account from "../Account";
import Export from "../Export";
import Participant from "../Participant";
import Deployments from "../Deployments";
import Participants from "../Participants";
import Protocol from "../Protocol";
import Protocols from "../Protocols";
import Resources from "../Resources";
import Studies from "../Studies";
import StudyAnnouncementEdit from "../StudyAnnouncementEdit";
import StudyAnnouncementNew from "../StudyAnnouncementNew";
import StudyAnnouncements from "../StudyAnnouncements";
import StudyOverview from "../StudyOverview";
import StudyProtocol from "../StudyProtocol";
import StudySettings from "../StudySettings";
import Translations from "../Translation";
import ProtectedRoute from "./ProtectedRoute";
import Deployment from "../Deployment";

const App = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies"
          element={
            <ProtectedRoute>
              <Studies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/protocols"
          element={
            <ProtectedRoute>
              <Protocols />
            </ProtectedRoute>
          }
        />
        <Route
          path="/protocols/:id"
          element={
            <ProtectedRoute>
              <Protocol />
            </ProtectedRoute>
          }
        />

        <Route
          path="/studies/:id/overview"
          element={
            <ProtectedRoute>
              <StudyOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/settings"
          element={
            <ProtectedRoute>
              <StudySettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/protocol"
          element={
            <ProtectedRoute>
              <StudyProtocol />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/translations"
          element={
            <ProtectedRoute>
              <Translations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/announcements"
          element={
            <ProtectedRoute>
              <StudyAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/announcements/new"
          element={
            <ProtectedRoute>
              <StudyAnnouncementNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/announcements/:annId/edit"
          element={
            <ProtectedRoute>
              <StudyAnnouncementEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/export"
          element={
            <ProtectedRoute>
              <Export />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/participants/deployments/:deploymentId/participants/:participantId"
          element={
            <ProtectedRoute>
              <Participant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/participants"
          element={
            <ProtectedRoute>
              <Participants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/participants/deployments"
          element={
            <ProtectedRoute>
              <Deployments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studies/:id/participants/deployments/:deploymentId"
          element={
            <ProtectedRoute>
              <Deployment />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/studies" />} />
      </Routes>
    );
  }

  return <LoadingLandingPage />;
};

export default App;
