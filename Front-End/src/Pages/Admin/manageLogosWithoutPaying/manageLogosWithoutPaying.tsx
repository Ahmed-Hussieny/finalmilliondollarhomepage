// import { useEffect, useMemo, useRef, useState } from 'react';
// import '../../PixelsPage/PixelsPage.css';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import { useAppDispatch } from '../../../Store/store';
// import { LogoEntry, SelectedCell } from '../../../interfaces';
// import { addUnPaindLogo, deleteLogo, getLogos, updateLogo } from '../../../Store/LogosSlices';
// import { useNavigate } from 'react-router-dom';
// import { isItValidCell, splitImageIntoPixels } from '../../../utils/ImageProcessing/splitImageIntoPixels';
// import { createFormData } from '../../../utils/handelFormData';
// import { setLoading, setToast } from '../../../Store/globalSlice';

// const ManageLogosWithoutPaying = () => {
//     const [selectedCells, setSelectedCells] = useState<HTMLDivElement[]>([]);
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const navigate = useNavigate()
//     const [Logos, setLogos] = useState<LogoEntry[]>([]);
//     const [pixelsLen , setPixelsLen] = useState(0);
//     const totalCells = 10000;
//     const dispatch = useAppDispatch();

//     const validationSchema = Yup.object({
//         username: Yup.string()
//             .min(3, "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل")
//             .required("اسم المستخدم مطلوب"),
//         email: Yup.string()
//             .email("البريد الإلكتروني غير صالح")
//             .required("البريد الإلكتروني مطلوب"),
//         title: Yup.string().required("العنوان مطلوب"),
//         description: Yup.string().required("الوصف مطلوب"),
//         rows: Yup.number()
//             .min(1, "يجب أن تكون الصفوف رقمًا بين 1 و 10")
//             .max(20, "يجب أن تكون الصفوف رقمًا بين 1 و 20")
//             .required("الصفوف مطلوبة"),
//         cols: Yup.number()
//             .min(1, "يجب أن تكون الأعمدة رقمًا بين 1 و 10")
//             .max(20, "يجب أن تكون الأعمدة رقمًا بين 1 و 20")
//             .required("الأعمدة مطلوبة"),
//         logoLink: Yup.string().required("رابط الشعار مطلوب"),
//     });

//     const formik = useFormik({
//         initialValues: {
//             _id: "",
//             username: "",
//             email: "",
//             title: "",
//             description: "",
//             rows: "",
//             cols: "",
//             logoLink: "",
//             image: null
//         },
//         validationSchema,
//         onSubmit: (val) => {
//             console.log(val);
//         },
//     });

//     const fetchData = async () => {
//         dispatch(setLoading(true));
//         setSelectedCells([]);
//         const { logos } = await dispatch(getLogos()).unwrap();
//         setLogos(logos);
//         renderTheGrid();
//     };
    
//     const renderTheGrid = () => {
        
//         Logos?.forEach((entry: LogoEntry) => {
//             entry?.pixels?.forEach((cell) => {
//                 const cellElement = document.querySelector(
//                     `[data-id="${cell.pixelNumber}"]`
//                 ) as HTMLDivElement;
//                 if (cellElement) {
//                     const canvas = document.createElement("canvas");
//                     const ctx = canvas.getContext("2d");
//                     const img = new Image();
//                     img.src = cell.smallImage;
//                     img.onload = () => ctx?.drawImage(img, 0, 0);
//                     cellElement.innerHTML = "";
//                     cellElement.appendChild(canvas);
//                     cellElement.style.backgroundColor = "transparent";
//                     cellElement.title = entry.title;
//                     cellElement.onclick = () => {
//                         setSelectedCells(
//                             entry.pixels.map((pixel) =>
//                                 document.querySelector(
//                                     `[data-id="${pixel.pixelNumber}"]`
//                                 ) as HTMLDivElement
//                             )
//                         );
//                         resetForm();
//                         formik.values._id = entry._id;
//                         formik.values.username = entry.username;
//                         formik.values.email = entry.email;
//                         formik.values.title = entry.title;
//                         formik.values.description = entry.description;
//                         formik.values.rows = entry.rows;
//                         formik.values.cols = entry.cols;
//                         formik.values.logoLink = entry.logoLink;
//                         setPixelsLen(entry.pixels.length);
//                     };
//                 }
//             });
//         });
//         dispatch(setLoading(false));
//     };
//     useMemo(() => {
//         renderTheGrid();
//     } , [Logos]);

//     useEffect(() => {
//         if (!localStorage.getItem('token')) {
//             dispatch(setToast({ message: "الرجاء تسجيل الدخول", type: "error" }));
//             navigate('/login');
//         }
//         fetchData();
//     }, []);

//     const handleDeleteLogo = async () => {
//         dispatch(setLoading(true));
//         const data = await dispatch(deleteLogo({ id: formik.values._id })).unwrap();
//         console.log(data)
//         if (data?.response?.data?.errCode) {
//             dispatch(setLoading(false));
//             dispatch(setToast({ message: "الرجاء تسجيل الدخول مرة اخري", type: "error" }));
//             navigate('/login');
//         }
//         if (data.success) {
//             dispatch(setToast({ message: "تم حذف الشعار بنجاح", type: "success" }));
//             window.location.reload();
//         }
//     };

//     const handelUpdateLogo = async () => {
//         dispatch(setLoading(true));
//         sortCells();
//         let cells: SelectedCell[] = [];
//         if(selectedCells.length > pixelsLen && formik.values.image == null){
//             dispatch(setToast({ message: "لابد من اختيار الصورة مره اخري", type: "error" }));
//             dispatch(setLoading(false));
//             return;
//         }
//         if (selectedCells.length !== (parseInt(formik.values.rows, 10) * parseInt(formik.values.cols, 10))) {
//             dispatch(setToast({ message: "عدد الخلايا المحددة لا يتطابق مع عدد الصفوف والأعمدة المحددة", type: "error" }));
//             dispatch(setLoading(false));
//             return ;
//         }
//         if (formik.values.image) {
//             const image = new Image();
//             image.src = URL.createObjectURL(formik.values.image);
//             cells = await splitImageIntoPixels(image, formik.values.cols, formik.values.rows, selectedCells);
//         }
//         const apiData = createFormData(cells, formik.values);
//         const {payload} = await dispatch(updateLogo({ id: formik.values._id, apiData })) as { payload: { response?: { data?: { errCode?: string } }, success?: boolean } };
//         if (payload?.response?.data?.errCode) {
//             dispatch(setLoading(false));
//             dispatch(setToast({ message: "الرجاء تسجيل الدخول مرة اخري", type: "error" }));
//             navigate('/login');
//         }
//         setSelectedCells([]);
//         if((payload as { success: boolean }).success){
//             dispatch(setToast({ message: "تم تعديل الشعار بنجاح", type: "success" }));
//             if(fileInputRef.current){
//                 fileInputRef.current.value = "";
//             }
//             resetForm();
//         }
//         fetchData();
//         dispatch(setLoading(false));
//     };

//     const resetForm= ()=>{
//         formik.values._id = "";
//         formik.values.username = "";
//         formik.values.email = "";
//         formik.values.title = "";
//         formik.values.description = "";
//         formik.values.rows = "";
//         formik.values.cols = "";
//         formik.values.logoLink = "";
//         formik.values.image = null;
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ""; 
//         }
//     }

//     const toggleCellSelection = (cell: HTMLDivElement) => {
//         //* check if the cell is in any logo pixels
//         const cellId = parseInt(cell.getAttribute("data-id") || "0", 10);
//         const logoPixels = Logos?.map((entry: LogoEntry) => entry.pixels).flat();
//         const isCellInLogo = logoPixels?.some((pixel) => pixel.pixelNumber === cellId);
//         if (!isCellInLogo) {
//             setSelectedCells((prev) => {
//                 const isSelected = prev.includes(cell);
//                 if (isSelected) {
//                     cell.style.backgroundColor = "#ccc";
//                     return prev.filter((c) => c !== cell);
//                 } else {
//                     cell.style.backgroundColor = "#999";
//                     return [...prev, cell];
//                 }
//             });
//         }
//     };

//     const sortCells = () => {
//         selectedCells.sort((a, b) => {
//             const aId = parseInt(a.getAttribute("data-id") || "0", 10);
//             const bId = parseInt(b.getAttribute("data-id") || "0", 10);
//             return aId - bId;
//         });
//     };

//     const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if(selectedCells.length === 0){
//             dispatch(setToast({ message: "يجب تحديد الخلايا أولاً", type: "error" }));
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = ""; 
//             }
//             console.log(event.target.files?.[0]);
//             return;
//         }
//         const file = event.target.files?.[0];
//         if (!file || selectedCells.length === 0) return;
//         formik.setFieldValue("image", event.target.files?.[0]);
//     };

//     const handleFileChange = async () => {
//         dispatch(setLoading(true));
//         if (!isItValidCell(selectedCells, formik).isValid) {
//             dispatch(setToast({ message: isItValidCell(selectedCells, formik).errorMessage, type: "error" }));
//             dispatch(setLoading(false));
//             return;
//         }
//         sortCells();
//         if (!fileInputRef.current?.value || !formik.values.image) {
//             dispatch(setToast({ message: "يجب تحديد الملف", type: "error" }));
//             dispatch(setLoading(false));
//             return;
//         }
//         const image = new Image();
//         image.src = URL.createObjectURL(formik.values.image);
//         const cells = await splitImageIntoPixels(image, formik.values.cols, formik.values.rows, selectedCells);
//         const apiData = createFormData(cells, formik.values);
//         await handleSubmit(apiData);
//         setSelectedCells([]);
//         await fetchData();
        
//     };

//     const handleSubmit = async (apiData: FormData) => {
//         const {payload} = await dispatch(addUnPaindLogo({apiData})) as { payload: { success: boolean, data:{ message:string} , response :{data:{ errCode:number}} } };
//         console.log(payload);
//         if (payload?.response?.data?.errCode) {
//             dispatch(setLoading(false));
//             dispatch(setToast({ message: "الرجاء تسجيل الدخول مرة اخري", type: "error" }));
//             navigate('/login');
//         }
//         else if(payload.success){
//             dispatch(setToast({ message: "تم إضافة الشعار بنجاح", type: "success" }));
//             setSelectedCells([]);
//             resetForm();
//         }
//         await fetchData();
//     };

//     return (
//         <div>
//             <form className="form-container rtlDirection">
//                 <label className="form-label text-warning fw-bold mt-1">
//                     قم بتحديد البكسلات التي تود شرائها واكمل البيانات لاكمال عمليه الشراء<br />
//                     <span className="text-danger">
//                         (  يحتوي كل مربع على ١٠ بكسلات ، تكلفة المربع ٢٠ ريال لكل بكسل ٢ ريال فقط )
// </span>
//                 </label>
//                 <div className="row my-3">
//                     <div className="col-md-6">
//                         <input
//                             type="text"
//                             name="username"
//                             className="form-control"
//                             required
//                             placeholder="الاسم بالكامل"
//                             value={formik.values.username}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.username && formik.errors.username) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.username}</p>
//                             </div>
//                             : ""}
//                     </div>
//                     <div className="col-md-6">
//                         <input
//                             type="email"
//                             name="email"
//                             required
//                             className="form-control"
//                             placeholder="البريد الالكتروني"
//                             value={formik.values.email}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.email && formik.errors.email) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.email}</p>
//                             </div>
//                             : ""}
//                     </div>
//                 </div>

//                 <div className="row">
//                     <div className="col-md-6">
//                         <input
//                             type="text"
//                             name="title"
//                             required
//                             className="form-control"
//                             placeholder="العنوان"
//                             value={formik.values.title}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.title && formik.errors.title) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.title}</p>
//                             </div>
//                             : ""}
//                     </div>
//                     <div className="col-md-6">
//                         <textarea
//                             name="description"
//                             className="form-control"
//                             placeholder="الوصف"
//                             required
//                             value={formik.values.description}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.description && formik.errors.description) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.description}</p>
//                             </div>
//                             : ""}
//                     </div>
//                 </div>
//                 <div className="row my-3">
//                     <div className="col-md-6">
//                         <input
//                             type="number"
//                             name="rows"
//                             className="form-control"
//                             placeholder="الصفوف"
//                             required
//                             value={formik.values.rows}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.rows && formik.errors.rows) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.rows}</p>
//                             </div>
//                             : ""}

//                     </div>
//                     <div className="col-md-6">
//                         <input
//                             type="number"
//                             name="cols"
//                             className="form-control"
//                             placeholder="الاعمدة"
//                             required
//                             value={formik.values.cols}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.cols && formik.errors.cols) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.cols}</p>
//                             </div>
//                             : ""}
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-md-6">
//                         <input
//                             type="text"
//                             name="logoLink"
//                             className="form-control"
//                             placeholder=" رابط الشعار"
//                             value={formik.values.logoLink}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                         />
//                         {(formik.touched.logoLink && formik.errors.logoLink) ?
//                             <div className='alert alert-danger m-0 p-0 mt-2'>
//                                 <p className='m-0'>{formik.errors.logoLink}</p>
//                             </div>
//                             : ""}
//                     </div>
//                     <div className="col-md-6">
//                         <input
//                             id="file-upload"
//                             type="file"
//                             ref={fileInputRef}
//                             className="form-control"
//                             required
//                             accept="image/*"
//                             onChange={handleFile}
//                             title="اختر صورة"
//                             placeholder="اختر صورة"
//                         />
//                         {(formik.touched.image && formik.errors.image) ? <div className='alert alert-danger m-0 p-0 mt-2'>
//                             <p className='m-0'>{formik.errors.image}</p>
//                         </div> : ""}
//                     </div>
//                 </div>
//             </form>
//             <div className='d-flex justify-content-evenly my-2'>
//                 <button disabled={!(formik.isValid && formik.dirty) || formik.values._id !=""} type='button' onClick={handleFileChange} className='btn btn-success w-25 p-0 '>اضافة</button>
//                 <button disabled={formik.values._id == ""} type='button' onClick={handelUpdateLogo} className='btn btn-success w-25 p-0 '>تعديل</button>
//                 <button disabled={formik.values._id == ""} type='button' onClick={handleDeleteLogo} className='btn btn-danger w-25 p-0 '>حذف</button>
//             </div>

//             <div className="canvas-container">
//                 {Array.from({ length: totalCells }, (_, i) => (
//                     <div
//                         key={i}
//                         className="cell"
//                         data-id={i}
//                         onClick={(e) => toggleCellSelection(e.currentTarget)}
//                     ></div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default ManageLogosWithoutPaying
