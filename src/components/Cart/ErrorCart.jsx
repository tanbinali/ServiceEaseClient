import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCart = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="bg-error/10 p-6 rounded-2xl inline-block mb-6">
        <FaExclamationTriangle className="text-4xl text-error" />
      </div>
      <h1 className="text-2xl font-bold text-error mb-3">Cart Error</h1>
      <p className="text-base-content/60 mb-6">{error}</p>
      <button className="btn btn-primary btn-lg gap-2" onClick={retry}>
        Try Again
      </button>
    </div>
  </div>
);
