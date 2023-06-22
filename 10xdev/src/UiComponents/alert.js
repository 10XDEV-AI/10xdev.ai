import { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';

const Alert = (props) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowModal(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (props.type === 401) {
      window.location.href = 'https://10xdevai.com';
    }
  }, [props.type]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 400:
        return 'Error 400: Bad Request';
      case 401:
        return 'Error 401: Unauthorized Please login Again';
      case 403:
        return 'Error 403: Forbidden';
      case 404:
        return 'Error 404: Not Found';
        case 405:
        return 'Error 405: Method Not Allowed';
      case 408:
        return 'Error 408: Request Timeout';
      case 500:
        return 'Error 500: Internal Server Error';
      case 502:
        return 'Error 502: Bad Gateway';
      case 503:
        return 'Error 503: Service Unavailable';
      case 504:
        return 'Error 504: Gateway Timeout';
      default:
        return 'Error : Something went wrong';
    }
  };

  return (
    <>
      {showModal && (
        <div 
          className={`error-modal fixed px-4 flex bottom-4 right-4 bg-red-700 text-white p-4 rounded-md animate-fade-out`}
          style={{ animationDelay: '4s', width: '32rem', zIndex: '100' }}
        >
          <MdErrorOutline className="p-2 m-1" />
          <p> {getErrorMessage(props.type)}</p>
        </div>
      )}
    </>
  );
};

export default Alert;
