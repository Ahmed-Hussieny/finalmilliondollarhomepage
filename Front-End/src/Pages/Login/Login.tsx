
import { useFormik } from 'formik'
import { useState } from 'react'
import * as YUP from 'yup'
import '../../App.css'
import { useAppDispatch } from '../../Store/store';
import { handleLogin } from '../../Store/authSlice';
import { useNavigate } from 'react-router-dom';
import { LoginPayload } from '../../interfaces';
export default function Login() {
    const [errMessage, setErrMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertType, setAlertType] = useState("alert-danger");
      const dispatch = useAppDispatch();
    const validationSchema = YUP.object({
        email: YUP.string()
          .required("البريد الإلكتروني مطلوب")
          .email("يرجى إدخال بريد إلكتروني صالح")
          .matches(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "يرجى إدخال بريد إلكتروني صالح"
          ),
        password: YUP.string().required("كلمة المرور مطلوبة"),
      });
      
    const LoginForm = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: loginSubmit
    })
    const navigate = useNavigate()
    async function loginSubmit(val: { email: string; password: string }) {
        console.log(val);
        setLoading(true);
        const data = await dispatch(handleLogin({ email: val.email, password: val.password })) as { payload: LoginPayload };
        console.log(data);
        if (data?.payload?.errCode) {
            console.log(data?.payload?.errCode);
            setErrMessage(data.payload.message || "");
            setLoading(false);
            return;
        }else if(data?.payload?.userToken){
            setErrMessage(data.payload.message || "");
            localStorage.setItem('token', 'Bearer_' + data.payload.userToken);
            setAlertType('alert-success');
            navigate('/ManagePixels')
        }
        setLoading(false);
    }

    return (
        <div className='container mt-5 rtlDirection vh-100'>
<form
  onSubmit={LoginForm.handleSubmit}
  className="borderMaincolor p-4 w-100 rounded-3 shadow-lg"
>
  <h2 className="text-center mb-4 textMainColor">تسجيل الدخول</h2>
  {(errMessage) ?
                <div className={`alert ${alertType} p-2`}>
                    <p className='p-0 m-0'>{errMessage}</p>
                </div>
                : ""}
  {/* Email Input */}
  <div className="mb-3 text-end">
    <label htmlFor="email" className="form-label fw-bold text-secondary">
      البريد الإلكتروني:
    </label>
    <input
      onChange={LoginForm.handleChange}
      onKeyUp={LoginForm.handleBlur}
      type="email"
      name="email"
      id="email"
      className={`form-control ${
        LoginForm.touched.email && LoginForm.errors.email ? "is-invalid" : ""
      }`}
      placeholder="أدخل بريدك الإلكتروني"
    />
    {LoginForm.touched.email && LoginForm.errors.email && (
      <div className="invalid-feedback">{LoginForm.errors.email}</div>
    )}
  </div>

  {/* Password Input */}
  <div className="mb-3 text-end">
    <label htmlFor="password" className="form-label fw-bold text-secondary">
      كلمة السر:
    </label>
    <input
      onChange={LoginForm.handleChange}
      onKeyUp={LoginForm.handleBlur}
      type="password"
      name="password"
      id="password"
      className={`form-control ${
        LoginForm.touched.password && LoginForm.errors.password
          ? "is-invalid"
          : ""
      }`}
      placeholder="أدخل كلمة السر"
    />
    {LoginForm.touched.password && LoginForm.errors.password && (
      <div className="invalid-feedback">{LoginForm.errors.password}</div>
    )}
  </div>

  {/* Submit Button */}
  <div className="mt-4">
    {loading ? (
      <button
        type="button"
        title="Loading"
        className="btn mainColorBackground w-100 fw-bold d-flex align-items-center justify-content-center"
        disabled
      >
        <i className="fa-solid fa-spinner fa-spin me-2"></i> جاري التحميل...
      </button>
    ) : (
      <button
        disabled={!(LoginForm.isValid && LoginForm.dirty)}
        type="submit"
        className="btn mainColorBackground w-100 fw-bold"
      >
        تسجيل الدخول
      </button>
    )}
  </div>
</form>

        </div>
    )
}