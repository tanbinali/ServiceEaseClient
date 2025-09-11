import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

export const LoadingOrError = ({ loading, error, retry }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Loading carts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center p-8 bg-base-200 rounded-2xl max-w-md">
          <div className="bg-error/10 rounded-full p-4 inline-block mb-4">
            <FaExclamationTriangle className="text-3xl text-error" />
          </div>
          <h2 className="text-xl font-bold text-base-content mb-2">Error</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button onClick={retry} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};
