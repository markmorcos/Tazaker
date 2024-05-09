import { useState } from "react";
import axios from "axios";

export default ({ url, method, body, headers, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const requestData = (props) =>
    body instanceof FormData ? body : { ...body, ...props };

  const doRequest = async ({ headers: requestHeaders, ...props } = {}) => {
    try {
      setLoading(true);
      setErrors(null);
      const { data } = await axios[method](url, requestData(props), {
        headers: { ...headers, ...requestHeaders },
      });
      onSuccess?.(data);
      return data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return { doRequest, loading, errors };
};
