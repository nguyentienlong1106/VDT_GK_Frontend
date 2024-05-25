"use client";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import Link from "next/link";
import { SubmitHandler, ValidationRule, useForm } from "react-hook-form";
import { Student } from "@/types/student/student.type";

export default function Create() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Student>();

  const { trigger: addStudent, isMutating: isCreating } = useSWRMutation(
    "http://localhost:8000/students/add",
    async (url, { arg }: { arg: Student }) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }
    },
    {
      onSuccess: () => {
        toast.success("Student added successfully");
        reset();
      },
      onError: () => {
        toast.error("Failed to add student");
      },
    }
  );

  const onSubmit: SubmitHandler<Student> = (data) => {
    addStudent(data);
  };

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
    <>
      <h1 className="text-2xl py-4">Create student</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput name="Name" id="name" required />
        <FormInput name="Year" id="year" />
        <FormInput name="Email" id="email" />
        <FormInput name="Phone" id="phone" />
        <FormInput name="Sex" id="sex" required />
        <FormInput name="University" id="university" required />
        <FormInput name="Country" id="country" />

        <button disabled={isCreating} className="btn btn-primary" type="submit">
          Add Student
        </button>
        <Link href={`/students`} type="button" className="btn btn-primary ml-4">
          Back
        </Link>
      </form>
    </>
  );
}
