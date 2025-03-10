import { Placeholder } from "react-bootstrap";
import { FallbackImage } from "../../image-with-fallback/image-avatar";

export const LogoDisplay = ({ logo, isBusiness = true }) => (
  <div className="company_logo colMinWidth">
    {logo ? (
      <div className="d-flex justify-content-center align-items-center" style={{
        width: '40px',
        height: '40px',
        overflow: 'hidden',
        borderRadius: '4px',
        border: '0.5px solid #F2F4F7'
      }}>
        <FallbackImage photo={logo} is_business={isBusiness} has_photo={true} />
      </div>
    ) : (
      <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
        <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size="lg" />
      </Placeholder>
    )}
  </div>
);