import ProfileLayout from "../layout";

interface Props {
  params: { username: string };
}

export default function Page({ params }: Props) {
  const { username } = params;

  return <ProfileLayout username={username} />;
}
