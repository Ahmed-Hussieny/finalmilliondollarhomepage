import { useEffect } from 'react';
import '../../App.css'
import { getPixels } from '../../Store/LogosSlices';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
const AboutUs = () => {
  const dispatch = useAppDispatch();
    useEffect(() => {
      fetchData();
    });
    const fetchData = async () => {
      dispatch(setLoading(true));
      await dispatch(getPixels()).unwrap();
      dispatch(setLoading(false));
    };
    return (
      <div className="about-us-page vh-100 bg-light d-flex rtlDirection">
        {/* Content Section */}
        <div className="container py-5">
          <div className="row align-items-center mb-5">
          <div className=" text-center text-md-end" >
              <h2 className="text-warning">من نحن</h2>
              <p className="text-dark">
              صفحة المليون بكسل هي فكرة مبتكرة تهدف إلى تقديم مساحة إعلانية فريدة من نوعها , تجمع بين الابداع والبساطة . نحن نمنح الافراد و الشركات فرصة ليكونوا جزءاً من مشروع رقمي يعتمد على بيع مساحات صغيرة (البكسلات) في صفحة واحدة . بحيث يمكن للجميع ترك بصمتهم و الإعلان عن خدماتهم او منتجاتهم بطريقة مميزة لا تُنسى !
              </p>
            </div>
            
          </div>

          <div className="row align-items-center mb-5">
          
            <div className="col-md- text-center text-md-end" >
              <h2 className="textMainColor">رسالتنا</h2>
              <p className="text-dark">
             هي بناء لوحة إعلانية رقمية تمثل تنوع المجتمع العربي وإبداعاته , من خلال توفير منصة تفاعلية تعكس الروح الابتكارية وتتيح فرصة للجميع للمشاركة والابداع .
              </p>
            </div>
          </div>
  
          {/* Team Section */}
          <div className="text-center mb-5">
            <h2 className="textMainColor">فريقنا</h2>
            <p className="text-dark">
            انضم إلينا و كن جزءاً من هذه الفكرة الفريدة اللتي تجمع بين الفن , التقنية , والتسويق في تجربة إعلانية لا مثيل لها ستبقى للأبد !
            </p>
          </div>
          <div className="row justify-content-center">
            
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;