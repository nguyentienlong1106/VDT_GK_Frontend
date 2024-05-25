import Form from "./Form";

export function generateMetadata({ params }: { params: { _id: string } }) {
  return {
    title: `Edit Student ${params._id}`,
  };
}

export default function StudentEditPage({
  params,
}: {
  params: { _id: string };
}) {
  return <Form studentId={params._id} />;
}
