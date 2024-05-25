"use client";
import useSWRMutation from "swr/mutation";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import Link from "next/link";
import { ValidationRule, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Student } from "@/types/student/student.type";
import { useRouter } from "next/navigation";

export default function Form({ studentId }: { studentId: string }) {
  const { data: student, error } = useSWR(
    `http://localhost:8000/students/${studentId}`
  );
  const router = useRouter();
  const { trigger: updateStudent, isMutating: isUpdating } = useSWRMutation(
    `http://localhost:8000/students/${studentId}`,
    async (url, { arg }) => {
      try {
        const res = await fetch(`${url}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(arg),
        });
        if (!res.ok) {
          throw new Error("Failed to add student");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Student>();

  useEffect(() => {
    if (!student) return;
    setValue("name", student.name);
    setValue("year", student.year);
    setValue("email", student.email);
    setValue("phone", student.phone);
    setValue("sex", student.sex);
    setValue("university", student.university);
    setValue("country", student.country);
  }, [student, setValue]);

  const formSubmit = async (formData: any) => {
    await updateStudent(formData);
  };

  if (error) return error.message;
  if (!student) return "Loading...";

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Student;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="lg:flex mb-6">
      <label className="label xl:w-[30%]" htmlFor={id}>
        {name}
      </label>
      <div>
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="input input-bordered w-full max-w-md"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl py-4">Edit information student</h1>
      <div>
        <form className="w-full" onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="name" required />
          <FormInput name="Year" id="year" />
          <FormInput name="Email" id="email" />
          <FormInput name="Phone" id="phone" />
          <FormInput name="Sex" id="sex" required />
          <FormInput name="University" id="university" required />
          <FormInput name="Country" id="country" />
          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update
          </button>
          <Link className="btn ml-4 " href="/students">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}
