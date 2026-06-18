import { useForm } from "react-hook-form"
import CustomInput from "../components/CustomInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../schema/signupSchema"
import { Link } from 'react-router'
import { useAuthStore } from "../store/useAuthStore"

function SignUpPage() {

  const { signup , isSigningUp } = useAuthStore();

  const { control, handleSubmit , reset } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues : {
      username : "",
      email : "",
      password : ""
    }
  })

  const onSubmit = (data) => {
    signup(data);
    reset();
  }

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-2xl p-5 md:p-10 rounded-2xl bg-slate-600">
        <h1 className="text-2xl uppercase font-bold text-center">SignUp</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            control={control}
            name="username"
            label="username"
            placeholder="Type username" 
          />
          <CustomInput
            control={control}
            name="email"
            label="email"
            placeholder="Type email" 
          />
          <CustomInput
            control={control}
            name="password"
            label="Password"
            placeholder="Type Password"
            type="password"
          />
          <button
            type="submit"
            className="w-full flex cursor-pointer z-20 justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7-5 bg-blue-500"
          >
            {isSigningUp ? "Loading..." : "SignUp"}
          </button>
          <div className="mt-2">
              I have already account? <Link to="/login" className="text-blue-500">Login Now !</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage