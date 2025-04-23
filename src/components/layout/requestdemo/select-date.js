import React, { useState, useEffect } from 'react';
import { InlineWidget } from "react-calendly";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { setupCalendlyEventListener, getEventDetails, formatCalendlyDate } from "../../../APIs/calendly-api";
import { requestDemoCreate } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
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

  // Function to submit the form data
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
      date: date || formatCalendlyDate(new Date().toISOString()) // Use provided date or today's date as fallback
    };

    // Call the API function to submit data
    requestDemoCreate(mainData)
      .then((responseData) => {
        // Log the success data
        console.log('Success data:', responseData);
        // Navigate to the next step if API call succeeds
        navigate("/allset");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form. Please try again.");
        setEventScheduled(true); // Still mark as scheduled so user can try again
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Set up Calendly event listener
  useEffect(() => {
    // This function will be called when a Calendly event is scheduled
    const handleEventScheduled = async (eventURI) => {
      try {
        setIsLoading(true);
        // Get the event details from Calendly API
        const eventData = await getEventDetails(eventURI);

        // Extract the start time from the event
        const startTime = eventData.resource.start_time;

        // Format the date to DD-MM-YYYY format
        const formattedDate = formatCalendlyDate(startTime);

        // Set the selected date
        setSelectedDate(formattedDate);
        setEventScheduled(true);

        // Show success message
        toast.success('Meeting scheduled successfully!');

        // Automatically submit the form with the selected date
        submitFormData(formattedDate);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error('Failed to get meeting details. Please try again.');
        setIsLoading(false);
      }
    };

    // Set up the event listener
    const cleanup = setupCalendlyEventListener(handleEventScheduled);

    // Clean up the event listener when component unmounts
    return cleanup;
  }, [navigate, first_name, last_name, country, phone, email, company_name, company_description, company_size]); // Add all dependencies

  // Manual submission if the user clicks the button
  const handleStepOne = () => {
    if (!selectedDate && !eventScheduled) {
      toast.error('Please schedule a meeting first');
      return;
    }

    // Use the same submitFormData function for consistency
    submitFormData(selectedDate);
  };


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
                  <h2>
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h2>
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
                  <button
                    type='button'
                    className="fillbtn flexcenterbox mt-3"
                    onClick={handleStepOne}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <ProgressSpinner style={{ width: '20px', height: '20px', color: '#fff' }} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Next Step
                        <img src={arrowRight} alt="Arrow Right" />
                      </>
                    )}
                  </button>

                  {eventScheduled && !isLoading && (
                    <div className="alert alert-success mt-3" role="alert">
                      Meeting scheduled for {selectedDate}. You will be redirected automatically.
                    </div>
                  )}

                  {isLoading && (
                    <div className="alert alert-info mt-3" role="alert">
                      Processing your booking. Please wait...
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
