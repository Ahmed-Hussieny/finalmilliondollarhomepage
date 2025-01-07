import { useEffect } from "react"
import { getPixels } from "../../Store/LogosSlices";
import { useAppDispatch } from "../../Store/store";
import { setLoading } from "../../Store/globalSlice";

export default function PolicyPage() {
    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(setLoading(true));
        dispatch(getPixels()).unwrap();
        dispatch(setLoading(false));
    }, [dispatch])

    return (
        <div className="about-us-page vh-100 bg-light d-flex rtlDirection">
            {/* Content Section */}
            <div className="container py-5">
                <div className="row align-items-center mb-5">
                    <div className=" text-center text-md-end" >
                        <h2 className="text-warning">السياسة والشروط</h2>
                        <p className="text-dark">
                            جميع الشعارات او الاعلانات التي يتم وضعها على الموقع هي مسؤولية المعلنين فقط لا تتحمل صفحة المليون بكسل اي مسؤولية عن مصداقية الاعلان او اي اضرار ناتجة عن استخدامها .
                        </p>
                        <p className="text-dark">
                            نحن نعمل على ضمان تشغيل الموقع بشكل امن ومستقر ولكن لا نتحمل مسؤولية اي انقطاع الخدمة او اي خلل فني قد يحدث
                        </p>
                        <p className="text-dark">
                            نحن ملتزمون في بحماية بيانات العملاء والحفاظ على سرية اي معلومات يتم مشاركتها معنا
                        </p>
                        <p className="text-dark">
                            نحتفظ بالحق في تعديل او تحديث هذه الشروط في اي وقت دون اشعاو مسبق ، ينصح بمراجعة الصفحة بشكل دوري للتعرف على اي تغييرات              </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
