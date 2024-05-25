"use client";

// import { formatId } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Student } from "@/types/student/student.type";

export default function Students() {
  const {
    data: students,
    error,
    mutate,
  } = useSWR(`http://localhost:8000/students`);

  const router = useRouter();

  const { trigger: deleteStudent } = useSWRMutation(
    `http://localhost:8000/students`,
    async (url, { arg }: { arg: { studentId: string } }) => {
      const toastId = toast.loading("Deleting student...");
      const res = await fetch(`${url}/${arg.studentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Student deleted successfully", {
          id: toastId,
        });
        // Optionally revalidate the SWR cache
        mutate();
      } else {
        const data = await res.json();
        toast.error(data.message, {
          id: toastId,
        });
      }
    }
  );

  if (error) return "An error has occurred.";
  if (!students) return "Loading...";

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">List students VDT 2024</h1>

        <Link
          href={`students/add`}
          type="button"
          className="btn btn-primary btn-sm"
        >
          Create
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra bg-gray-300">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Sex</th>
              <th>University</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: Student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.sex}</td>
                <td>{student.university}</td>
                <td>
                  <Link
                    href={`students/${student._id}`}
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => deleteStudent({ studentId: student._id })}
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
