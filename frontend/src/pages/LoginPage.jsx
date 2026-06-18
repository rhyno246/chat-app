import { zodResolver } from "@hookform/resolvers/zod"
import CustomInput from "../components/CustomInput"
import { useForm } from "react-hook-form"
import { loginSchema } from '../schema/loginSchema'
import { Link } from "react-router"
import { useAuthStore } from "../store/useAuthStore"

function LoginPage() {
    const { login ,  isLogin } = useAuthStore();
    const { control, handleSubmit , reset } = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues : {
        username : "",
        email : "",
        password : ""
      }
    })
  
    const onSubmit = (data) => {
      login(data)
      reset();
    }
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-2xl p-5 md:p-10 rounded-2xl bg-slate-600">
        <h1 className="text-2xl uppercase font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            { isLogin ? "loading...." : "Sign in" }
          </button>
          <div className="mt-2">
              Don't have an account? <Link to="/signup" className="text-blue-500">SignUp Now !</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage