import React, { useEffect, useState } from 'react';
import { SwiperSlide,Swiper } from 'swiper/react'; // Import SwiperSlide
import FetchData from '../../../Utils/FetchData';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Import autoplay styles

// Import Swiper modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import MainSkeleton from './MainSkeleton';

export default function MainSlider() {
  const [sliders, setSlider] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
       const result = await FetchData('sliders?limit=20&page=1');
        setSlider(result.data || []);
    })()
  }, []);

  const items = sliders?.map(sl => (
    <SwiperSlide className='w-full h-full' key={sl._id}  >
      <img src={import.meta.env.VITE_BASE_FILE + sl.image} alt={sl.title} className='w-full h-full object-cover' /> {/* Added object-cover */}
    </SwiperSlide>
  )) || []; 
  if(sliders.length==0)return <MainSkeleton/>
  return (

    <Swiper
      modules={[Navigation, Pagination, Autoplay]} 
      spaceBetween={10} 
      slidesPerView={1}
      loop={true} // Enable looping
      autoplay={{
        delay: 5000, // Autoplay delay in ms (e.g., 5 seconds)
        disableOnInteraction: false, // Keep autoplaying even after user interaction
      }}
      pagination={{
        clickable: true, // Allow clicking on pagination dots
      }}
      navigation={true} // Enable navigation arrows
      className={'w-[90%] h-[70vh] mx-auto rounded-2xl my-4 overflow-hidden'} // Your existing class for styling
    >
      {items}
    </Swiper>
  );
}
