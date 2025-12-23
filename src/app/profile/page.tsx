import { Suspense } from "react";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Carregando perfil...</div>}>
      <ProfileForm />
    </Suspense>
  );
}