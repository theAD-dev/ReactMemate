import React, { useState, useEffect } from 'react';
import { InlineWidget } from "react-calendly";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import { setupCalendlyEventListener, getEventDetails, formatCalendlyDate } from "../../../APIs/calendly-api";
import { requestDemoCreate } from "../../../APIs/OnboardingApi";
import request04 from "../../../assets/images/img/request04.jpg";
import LoinLogo from "../../../assets/images/logo.svg";
import Loader from "../../../shared/ui/loader/loader";


const SelectDate = () => {
  const location = useLocation();
  const { first_name, last_name, country, phone, email, company_name, company_description, company_size } = location.state;
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eventScheduled, setEventScheduled] = useState(false);

  const submitFormData = (date) => {
    setIsLoading(true);

    const mainData = {
      first_name: first_name,
      last_name: last_name,
      country: country,
      phone: phone,
      email: email,
      company_name: company_name,
      company_description: company_description,
      company_size: company_size,
      is_agree_marketing: true,
      date: date || formatCalendlyDate(new Date().toISOString())
    };

    requestDemoCreate(mainData)
      .then((responseData) => {
        console.log('Success data:', responseData);
        navigate("/allset", { replace: true });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form. Please try again.");
        setEventScheduled(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handleEventScheduled = async (eventURI) => {
      try {
        setIsLoading(true);
        const eventData = await getEventDetails(eventURI);

        const startTime = eventData.resource.start_time;
        const formattedDate = formatCalendlyDate(startTime);

        setSelectedDate(formattedDate);
        setEventScheduled(true);

        toast.success('Meeting scheduled successfully!');

        submitFormData(formattedDate);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error('Failed to get meeting details. Please try again.');
        setIsLoading(false);
      }
    };

    const cleanup = setupCalendlyEventListener(handleEventScheduled);

    return cleanup;
  }, [navigate, first_name, last_name, country, phone, email, company_name, company_description, company_size]);

  return (
    <>
      <div className='requestDemoWrap request-calendly-date'>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo" style={{ flexDirection: 'column', overflow: 'auto' }}>
                <div className="w-100 p-4">
                  <img src={LoinLogo} alt="Loin Logo" />
                </div>

                <div className="boxLogin w-100">
                  <h1>
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h1>
                  <div className="step-progress">
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step active" ></div>
                    <div className="step"></div>
                  </div>

                  <div className='calendly-container' style={{ padding: '0px 60px', position: 'relative', minHeight: '400px' }}>
                    {isLoading && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                        <Loader />
                      </div>
                    )}
                    <InlineWidget
                      url="https://calendly.com/memate/memate-demo"
                      styles={{
                        width: '100%',
                        border: '1px solid #f2f2f2',
                        height: '600px'
                      }}
                      prefill={{
                        name: `${first_name} ${last_name}`,
                        email: email,
                      }}
                      pageSettings={{
                        hideEventTypeDetails: false,
                        hideLandingPageDetails: false,
                        primaryColor: '#1D2939',
                        textColor: '#667085'
                      }}
                    />
                  </div>

                  {eventScheduled && !isLoading && (
                    <div className="alert alert-success mt-3" role="alert">
                      Meeting scheduled for {selectedDate}. You will be redirected automatically.
                    </div>
                  )}
                  <div className="linkBottom"><p>Already have an account? <Link to="/login">Sign in</Link></p></div>
                </div>

                <div className="w-100 p-4 footer-copyright">
                  <span className="font-14" style={{ color: '#212529' }}>© Memate {new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${request04})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
                <p>Predict unprofitable business activities.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SelectDate;
