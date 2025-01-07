import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../Store/store";
import { setLoading, setToast } from "../../Store/globalSlice";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { addPixel, getGridImage, getGridTempImage, getPixels } from "../../Store/LogosSlices";
import { AddPixelPayload } from "../../interfaces";

export default function AddPixel() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [urlPay, setUrlPay] = useState("");
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, text: '' });
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            await dispatch(getPixels()).unwrap();
            const data = await dispatch(getGridImage()).unwrap();
            setSvgContent(data);
            dispatch(setLoading(false));
        };
        fetchData();
    }, [dispatch]);

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const mouseX = event.clientX - svgRect.left;
            const mouseY = event.clientY - svgRect.top;
            const svgWidth = svgRect.width;
            const svgHeight = svgRect.height;
            const percentX = (mouseX / svgWidth) * 100;
            const percentY = (mouseY / svgHeight) * 100;
            setTooltip({
                x: percentX,
                y: percentY,
                visible: true,
                text: ` (${(Math.floor(percentX))}:العمود )  (الصف :${(Math.floor(percentY)).toFixed(0)})`, // Tooltip content
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل")
            .required("اسم المستخدم مطلوب"),
        email: Yup.string()
            .email("البريد الإلكتروني غير صالح")
            .required("البريد الإلكتروني مطلوب"),
        title: Yup.string().required("العنوان مطلوب"),
        description: Yup.string().required("الوصف مطلوب"),
        row: Yup.number().min(0, "يجب أن تكون الأعمدة رقمًا بين 0 و 100")
            .max(100, "يجب أن تكون الأعمدة رقمًا بين 0  و 100")
            .required("الأعمدة مطلوبة"),
        col: Yup.number()
            .min(0, "يجب أن تكون الصفوف رقمًا بين 0 و 100")
            .max(100, "يجب أن تكون الصفوف رقمًا بين 0 و 100")
            .required("الصفوف مطلوبة"),
        width: Yup.number().
        min(1,' يجب ان يكون العرض بين 1 و 100').
        max(100, ' يجب ان يكون العرض بين 1 و 100').required("العرض مطلوب بالبكسل"),
        height: Yup.number().
        min(1,' يجب ان يكون الطول بين 1 و 100').
        max(100, ' يجب ان يكون الطول بين 1 و 100').required("الطول مطلوب بالبكسل"),
        url: Yup.string().required("رابط الشعار مطلوب"),
        image: Yup.mixed().required("الصورة مطلوبة"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            title: "",
            description: "",
            row: "",
            col: "",
            url: "",
            width: "",
            height: "",
            image: null
        },
        validationSchema,
        onSubmit: async (val) => {
            dispatch(setLoading(true));
            const apiData = new FormData();
            apiData.append("username", val.username);
            apiData.append("email", val.email);
            apiData.append("title", val.title);
            apiData.append("description", val.description);
            apiData.append("position", JSON.stringify({ x: parseInt(val.row) * 10, y: parseInt(val.col) * 10 }));
            apiData.append("url", val.url);
            apiData.append("type", "image");
            apiData.append("size", JSON.stringify({ width: parseInt(val.width) * 10, height: parseInt(val.height) * 10 }));
            if (val.image) {
                apiData.append("image", val.image);
            }
            const { payload } = await dispatch(addPixel({ apiData })) as { payload: AddPixelPayload};

            if (payload.success) {
                dispatch(setToast({ message: "تم إضافة الشعار بنجاح الرجاء التوجه للشراء للتاكيد", type: "success" }));
                resetForm();
                if (payload.paymentLink) {
                    setUrlPay(payload.paymentLink);
                }
            } else {
                const errorMessage = payload.response?.data?.message || "An error occurred";
                dispatch(setToast({ message: errorMessage, type: "error" }));
            }
            const data = await dispatch(getGridTempImage()).unwrap();
            setSvgContent(data);
            dispatch(setLoading(false));
        },
    });

    const navigateToPay = () => {
        if (urlPay) window.location.href = urlPay;
    };

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            dispatch(setToast({ message: "الرجاء تحديد الوقو", type: "error" }));
        }
        formik.setFieldValue("image", event.target.files?.[0]);
    };

    const resetForm = () => {
        formik.values.username = "";
        formik.values.email = "";
        formik.values.title = "";
        formik.values.description = "";
        formik.values.row = "";
        formik.values.col = "";
        formik.values.url = "";
        formik.values.image = null;
        formik.values.width = "";
        formik.values.height = "";
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
    return (
        <div>
            <form className="container rtlDirection" >
                <label className="form-label text-warning fw-bold mt-1">
                    قم بتحديد البكسلات التي تود شرائها واكمل البيانات لاكمال عمليه الشراء<br />
                    <span className="text-danger">
                        (  يحتوي كل مربع على ١٠ بكسلات ، تكلفة المربع ٢٠ ريال لكل بكسل ٢ ريال فقط )

                    </span>
                    <br />
                    <span className="text-danger"> (  لقبول طلبكم الرجاء وضع اللوقو باللغة العربية فقط )</span>
                </label>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            required
                            placeholder="الاسم بالكامل"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.username && formik.errors.username) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.username}</p>
                            </div>
                            : ""}
                    </div>
                    <div className="col-md-6">
                        <input
                            type="email"
                            name="email"
                            required
                            className="form-control"
                            placeholder="البريد الالكتروني"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.email && formik.errors.email) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.email}</p>
                            </div>
                            : ""}
                    </div>
                </div>

                <div className="row gy-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="title"
                            required
                            className="form-control"
                            placeholder="العنوان"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.title && formik.errors.title) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.title}</p>
                            </div>
                            : ""}
                    </div>
                    <div className="col-md-6">
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="الوصف"
                            required
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.description && formik.errors.description) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.description}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input
                            type="number"
                            name="row"
                            className="form-control"
                            placeholder="العمود"
                            required
                            value={formik.values.row}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.row && formik.errors.row) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.row}</p>
                            </div>
                            : ""}
                    </div>
                    <div className="col-md-6">
                        <input
                            type="number"
                            name="col"
                            className="form-control"
                            placeholder="الصف"
                            required
                            value={formik.values.col}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.col && formik.errors.col) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.col}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input type="number" name="width" className="form-control" placeholder="العرض" required value={formik.values.width} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {(formik.touched.width && formik.errors.width) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.width}</p>
                        </div> : ""}
                    </div>

                    <div className="col-md-6" >
                        <input type="number" name="height" className="form-control" placeholder="الارتفاع" required value={formik.values.height} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {(formik.touched.height && formik.errors.height) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.height}</p> </div> : ""}
                    </div>
                </div>
                <div className="row gy-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="url"
                            className="form-control"
                            placeholder=" رابط الشعار"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.url && formik.errors.url) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.url}</p>
                            </div>
                            : ""}
                    </div>

                    <div className="col-md-6">
                        <input
                            id="file-upload"
                            type="file"
                            ref={fileInputRef}
                            className="form-control"
                            required
                            accept="image/*"
                            onChange={handleFile}
                            title="اختر صورة"
                            placeholder="اختر صورة"
                        />
                        {(formik.touched.image && formik.errors.image) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.image}</p>
                        </div> : ""}
                    </div>
                </div>
            </form>
            <div className='d-flex justify-content-evenly px-5 mx-5 my-2'>
                <button disabled={!(formik.isValid && formik.dirty)} type='button'
                    onClick={() => formik.handleSubmit()}
                    className='btn btn-success w-25 p-0 '>ارسال</button>
                <div className="arrow-container w-50">
                    {urlPay &&
                        <span className="arrow">
                            <i className="fa-solid fa-arrow-right fs-3 textMainColor"></i>
                        </span>}
                </div>
                <button className='btn btn-primary w-25 p-0' type='button' onClick={() => navigateToPay()} disabled={urlPay == ""}>شرائها</button>
            </div>
            <div className="w-100 border border-black position-relative">
                <svg
                    ref={svgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    width="100%"
                    height="100%"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    dangerouslySetInnerHTML={{ __html: svgContent! }}
                />
                {tooltip.visible && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${tooltip.y - 2}%`,
                            left: `${tooltip.x}%`,
                            transform: 'translate(-50%, -100%)',
                            background: 'rgba(0, 0, 0, 0.75)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            pointerEvents: 'none',
                        }}
                    >
                        {tooltip.text}
                    </div>
                )}
            </div>
        </div>
    )
}
