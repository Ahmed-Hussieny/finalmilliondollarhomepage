import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import { getGridImage, getPixels } from '../../Store/LogosSlices';

export default function HomePage () {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {

    const fetchData = async () => {
      dispatch(setLoading(true));
      const data = await dispatch(getGridImage()).unwrap();
      setSvgContent(data);
      dispatch(getPixels()).unwrap();
      dispatch(setLoading(false));
    };

    fetchData();

  }, [dispatch]);

  return (
    <div className="w-100 border border-black position-relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        dangerouslySetInnerHTML={{ __html: svgContent! }}
      />
    </div>
  );
};