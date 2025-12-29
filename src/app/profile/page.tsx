import { Suspense } from "react";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      Carregando perfil...
    </div>}>
      <ProfileForm />
    </Suspense>
  );
}