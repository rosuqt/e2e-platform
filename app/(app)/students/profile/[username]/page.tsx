import ProfilePublicLayout from "./profile-public-layout";

export default function Page({ params }: { params: { username: string } }) {
  return <ProfilePublicLayout username={params.username} />;
}
