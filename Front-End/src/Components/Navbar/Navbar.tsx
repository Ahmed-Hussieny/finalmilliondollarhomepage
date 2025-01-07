import { useLocation, useNavigate } from "react-router-dom"
import '../../App.css'
import logo from '../../assets/Images/logo.jpeg'
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const { numberOfPixelsUsed } = useSelector((state: { LogoData: { numberOfPixelsUsed: number } }) => state.LogoData);

  return (
    <nav className="navbar p-0 pt-2 bg-black rtlDirection">
      <div className="d-flex justify-content-between">
        <div className='col-3'>
          <img className="w-75 pointer" onClick={() => navigate('/')} src={logo} alt="logo" />
        </div>
        <div className='col-md-8 d-flex justify-content-around font12px'>
          <div className="d-flex justify-content-between align-items-center col-md-8">
            <p className="text-white"><span className='dot'></span> 1,000,000 بكسل</p>
            <p className="text-white"><span className='dot'></span> ٢ ريال سعودي لكل بكسل</p>
            <p className="text-white"><span className='dot'></span> امتلك قطعة من تاريخ الإنترنت! </p>
          </div>
          <div className='rounded-3 col-md-3 px-2 borderMaincolor d-flex flex-column justify-content-center'>
            <p className="text-white m-0 d-flex px-1 justify-content-between">تم بيع : <span>{numberOfPixelsUsed}</span></p>
            <p className="text-white m-0 d-flex px-1 justify-content-between"> المتبقي : <span>{1000000 - numberOfPixelsUsed}</span></p>
          </div>
        </div>
      </div>
      <div className='w-100 mainColorBackground mt-2'>
        <button className={`btnCustom me-2 ${isActive("/") ? "primary" : ""}`} onClick={() => navigate('/')} type="button"><span>الصفحة الرئيسية</span></button>
        <span>|</span>
        <button className={`btnCustom ${isActive("/buyPixel") ? "primary" : ""}`} onClick={() => navigate('/buyPixel')} type="button"><span>اشتري بيكسل</span></button><span>|</span>
        <button className={`btnCustom ${isActive("/AboutUs") ? "primary" : ""}`} onClick={() => navigate('/AboutUs')} type="button"><span>من نحن</span></button><span>|</span>
        <button className={`btnCustom ${isActive("/policyPage") ? "primary" : ""}`} onClick={() => navigate('/policyPage')} type="button"><span>سياسة الخصوصية</span></button><span>|</span>
        <button className={`btnCustom ${isActive("/ContactUs") ? "primary" : ""}`} onClick={() => navigate('/ContactUs')} type="button"><span>تواصل معنا</span></button>
      </div>
      
    </nav>
  )
}

export default Navbar;
